import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const getFinger = async () => {
 
  const fp = await FingerprintJS.load()
  fp.get()
  return fp.get({ debug: true })
}
