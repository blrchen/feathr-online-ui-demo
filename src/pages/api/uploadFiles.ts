import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import path from 'path'
import PDFParser from 'pdf-parse'
import { encode } from 'gpt-3-encoder'
import { ENVConfig, GetEmbeddings } from './chat-completion'
import { createHash } from 'crypto'
import dayjs from 'dayjs'
export const config = {
  api: {
    bodyParser: false
  }
}

type ProcessedFiles = Array<File>
type UploadFormData = { userHash: string; files: ProcessedFiles }

const currentPath = process.cwd()

const resolve = (...args: Array<string>) => {
  return path.join(currentPath, ...args).replaceAll('\\', '/')
}

// const mkdirs = (dirpath: string) => {
//   var dirArray = dirpath.split('/')
//   if (!fs.existsSync(dirpath)) {
//     fs.mkdir(0, dirArray)
//   }
// }

const saveFiles = async (data: UploadFormData) => {
  return await Promise.all(
    data.files.map((file) => {
      return new Promise<{ path: string; hashName: string; fileName: string }>(
        (resovle, reject) => {
          const fileName = file.newFilename + path.extname(file.originalFilename || '')
          const dir = `/public/files/${data.userHash}`
          const dirpath = resolve(dir)
          const newFilePath = path.join(dirpath, fileName)

          if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true })
          }
          const readStream = fs.createReadStream(file.filepath)
          const writeStream = fs.createWriteStream(newFilePath)
          readStream.pipe(writeStream)
          readStream.on('error', (err) => {
            reject(err)
          })
          readStream.on('end', () => {
            fs.unlinkSync(file.filepath)
            resovle({
              path: dir + '/' + fileName,
              hashName: file.newFilename,
              fileName: file.originalFilename || ''
            })
          })
        }
      )
    })
  )
}

const formParse = async (req: NextApiRequest) => {
  const data: UploadFormData = {
    userHash: '',
    files: []
  }
  data.files = await new Promise<ProcessedFiles>((resolve, reject) => {
    const form = new formidable.IncomingForm()

    const files: ProcessedFiles = []
    form.on('file', (field, file: File) => {
      if (file.mimetype === 'application/pdf') {
        files.push(file)
      }
    })
    form.on('end', () => resolve(files))
    form.on('error', (err) => reject(err))
    form.parse(req, (err, fields) => {
      data.userHash = fields.visitorId as string
    })
  }).catch(() => {
    return []
  })

  return data
}

const pdfParse = async (data: UploadFormData) => {
  const uniqueWords: string[] = []
  await Promise.all(
    data.files.map(async (file) => {
      const dataBuffer = fs.readFileSync(file.filepath)
      const pdfData = await PDFParser(dataBuffer)
      const words = pdfData.text
        .split(/\n/)
        .map((word) => word.trim())
        .filter((word) => word.length > 0)

      uniqueWords.push(...Array.from(new Set(words)))

      return uniqueWords
    })
  )
  return uniqueWords
}

const indexDocument = async (
  text: string,
  embedding: string,
  vector: string,
  documentIndex: number
) => {
  const response = await fetch(`${ENVConfig.es.url}/test_${vector}/_doc/${documentIndex}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: ENVConfig.es.authorization
    },
    body: JSON.stringify({
      content: text,
      [`test_${vector}_vector`]: embedding
    })
  })
  const reuslt = await response.json()
  return reuslt
}

const createVector = async (vector: string) => {
  const response = await fetch(`${ENVConfig.es.url}/test_${vector}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: ENVConfig.es.authorization
    },
    body: JSON.stringify({
      mappings: {
        properties: {
          [`test_${vector}_vector`]: {
            type: 'dense_vector',
            dims: 1536
          },
          content: {
            type: 'keyword'
          }
        }
      }
    })
  })
  const reuslt = await response.json()
  return reuslt
}

const embaddingWords = async (words: string[], vector: string) => {
  const apiUrl = `${ENVConfig.azure.url}/openai/deployments/${ENVConfig.azure.embeddingName}/embeddings?api-version=${ENVConfig.azure.version}`
  let start = 0
  let documentIndex = 0

  for (let i = 0; i < words.length; i++) {
    const currentText = words.slice(start, i).join(' ')
    const encodedLength = encode(currentText).length
    if (encodedLength > 1024) {
      start = i
      documentIndex++

      const embedding = await GetEmbeddings(
        apiUrl,
        ENVConfig.azure.key,
        ENVConfig.azure.embeddingModel,
        currentText
      )
      await indexDocument(currentText, embedding, vector, documentIndex)
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const formData = await formParse(req)
    const words = await pdfParse(formData)
    const filePaths = await saveFiles(formData)
    const hash = createHash('sha1')
    hash.update(formData.userHash)
    hash.update(filePaths.map((path) => path.hashName).join(''))
    hash.update(dayjs().format('YYYYMMddHHmmss'))
    const vector = hash.digest().toString('hex', 0, 4)
    await createVector(vector)
    await embaddingWords(words, vector)

    res.json({
      files: filePaths,
      vector
    })
  } catch (error: any) {
    res.status(500).json({ error: error.stack })
  }
}

export default handler
