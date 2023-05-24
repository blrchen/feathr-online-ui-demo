import { MutableRefObject, createContext } from 'react'

const GlobalContext = createContext<{
  onSearch?: (value: string) => void
  visitorId?: MutableRefObject<string>
}>({})

export default GlobalContext
