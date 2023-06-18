import { ChatConfig, Doc, Message } from '@/models'
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { encode } from 'gpt-3-encoder'
import base64 from 'base-64'
import { NextApiRequest, NextApiResponse } from 'next'
import { pipeline, Readable } from 'stream'
import { promisify } from 'util'

const pipelineAsync = promisify(pipeline)

export const ENVConfig = {
  openAI: {
    url: process.env.OPENAI_API_BASE_URL || '',
    key: process.env.OPENAI_API_KEY || ''
  },
  azure: {
    url: process.env.AZURE_OPENAI_API_BASE_URL || '',
    key: process.env.AZURE_OPENAI_API_KEY || '',
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT || '',
    version: process.env.AZURE_OPENAI_VERSION || '',
    embeddingName: process.env.AZURE_OPENAI_EMBEDDING_NAME || '',
    embeddingModel: process.env.AZURE_OPENAI_EMBEDDING_MODEL || ''
  },
  es: {
    url: process.env.ES_API_URL || '',
    user: process.env.ES_AUTH_USER || '',
    pass: process.env.ES_AUTH_PASS || '',
    authorization: `Basic ${base64.encode(
      process.env.ES_AUTH_USER + ':' + process.env.ES_AUTH_PASS
    )}`
  }
}

export const getAPIInfo = (
  config: ChatConfig,
  deployment: string = ENVConfig.azure.deployment,
  type: string = 'chat',
  method: string = 'completions'
) => {
  let apiUrl: string
  let apiKey: string
  let model = config.model || 'gpt-3.5-turbo' // todo: allow this to be passed through from client and support gpt-4

  if (ENVConfig.azure.url) {
    apiUrl =
      `${ENVConfig.azure.url}/openai/deployments/${deployment}/${type}/${method}?api-version=${ENVConfig.azure.version}`.replaceAll(
        '//',
        '/'
      )
    apiKey = ENVConfig.azure.key
    model = '' // Azure Open AI always ignores the model and decides based on the deployment name passed through.
  } else {
    apiUrl = `${ENVConfig.openAI.url || 'https://api.openai.com'}/v1/${type}/${method}`.replaceAll(
      '//',
      '/'
    )
    apiKey = ENVConfig.openAI.key
  }
  return { apiUrl, apiKey, model }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let { messages, prompts, config, doc } = JSON.parse(req.body) as {
      messages: Message[]
      prompts: Message[]
      config: ChatConfig
      doc?: Doc
    }
    if (doc?.vector) {
      prompts = []
      await DocQuestion(config, messages, doc)
    }
    const result = await Completions(config, messages, prompts)
    if (config.stream === false) {
      res.status(200).json(result)
    } else {
      pipelineAsync(result as unknown as Readable, res)
    }
  } catch (error: any) {
    res.status(500).json({ error: error.stack })
  }
}

const Completions = async (config: ChatConfig, messages: Message[], prompts: Message[]) => {
  const charLimit = 12000
  let charCount = 0
  let messagesToSend = []

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    if (charCount + message.content.length > charLimit) {
      break
    }
    charCount += message.content.length
    messagesToSend.push(message)
  }

  const { apiUrl, apiKey, model } = getAPIInfo(config)
  if (config.stream === false) {
    return await OpenAI(apiUrl, apiKey, model, messagesToSend, prompts)
  } else {
    return await OpenAIStream(apiUrl, apiKey, model, messagesToSend, prompts, config)
  }
}

const OpenAIStream = async (
  apiUrl: string,
  apiKey: string,
  model: string,
  messages: Message[],
  prompts: Message[],
  config: ChatConfig
) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'api-key': `${apiKey}`
    },
    method: 'POST',
    body: JSON.stringify({
      model: model,
      frequency_penalty: 0,
      max_tokens: 4000,
      messages: [...prompts, ...messages],
      presence_penalty: 0,
      stream: config.stream === undefined ? true : config.stream,
      temperature: 0.7,
      top_p: 0.95
    })
  })

  if (res.status !== 200) {
    const statusText = res.statusText
    throw new Error(
      `The OpenAI API has encountered an error with a status code of ${res.status} and message ${statusText}`
    )
  }

  return new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data

          if (data === '[DONE]') {
            controller.close()
            return
          }

          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta.content
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)

      for await (const chunk of res.body as any) {
        const str = decoder.decode(chunk).replace('[DONE]\n', '[DONE]\n\n')
        parser.feed(str)
      }
    }
  })
}

const OpenAI = async (
  apiUrl: string,
  apiKey: string,
  model: string,
  messages: Message[],
  prompts: Message[]
) => {
  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'api-key': `${apiKey}`
    },
    method: 'POST',
    body: JSON.stringify({
      model: model,
      frequency_penalty: 0,
      max_tokens: 4000,
      messages: [...prompts, ...messages],
      presence_penalty: 0,
      stream: false,
      temperature: 0.7,
      top_p: 0.95
    })
  })
  const json = await res.json()
  return {
    message: json.choices[0].message.content,
    usage: json.usage
  }
}

const DocQuestion = async (config: ChatConfig, messages: Message[], doc: Doc) => {
  const { apiUrl, apiKey } = getAPIInfo(config, '', ENVConfig.azure.embeddingName, 'embeddings')

  const message = messages[messages.length - 1]
  const embedding = await GetEmbeddings(
    apiUrl,
    apiKey,
    ENVConfig.azure.embeddingModel,
    message.content
  )
  const searchResults = await SearchDocuments(doc.vector, embedding)

  let contents = searchResults.map((hit: any) => hit._source.content)

  const context = getTopContents(contents).join(' ')

  message.content = `Answer the question based on the context below, and if the question can't be answered based on the context, say \"I don't know\"
  Context: ${context}
  ---
  Question: ${message.content}
  Answer: 请用中文回答`
}

export const GetEmbeddings = async (
  apiUrl: string,
  apiKey: string,
  model: string,
  input: string
) => {
  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'api-key': apiKey
    },
    method: 'POST',
    body: JSON.stringify({
      input: input,
      model
    })
  })

  const json = await res.json()
  if (json.error) {
    throw json.error
  } else {
    return json.data[0].embedding
  }
}

const SearchDocuments = async (vector: string, embedding: any) => {
  const res = await fetch(`${ENVConfig.es.url}/test_${vector}/_search`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: ENVConfig.es.authorization
    },
    method: 'POST',
    body: JSON.stringify({
      query: {
        script_score: {
          query: {
            match_all: {}
          },
          script: {
            source: `cosineSimilarity(params.query_vector, 'test_${vector}_vector')`,
            params: {
              query_vector: embedding
            }
          }
        }
      }
    })
  })
  const json = await res.json()
  return json.hits.hits
}

const getTopContents = (contents: string[]) => {
  for (let i = 0; i < contents.length; i++) {
    if (encode(contents.slice(0, i).join(' ')).length > 2000) {
      return contents.slice(0, i)
    }
  }
  return contents
}

export default handler
// "max_encoded_length": 1024,
// "maxEncodedLength": 2000,
// "completionMaxTokens": 800
