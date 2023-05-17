import { ChatMessage, ChatRole } from '@/components/ChatGPT/interface'
import { Doc } from '@/models'

export interface Persona {
  role: ChatRole
  avatar?: string
  name?: string
  prompt?: string
  doc?: Doc
}

export interface Chat {
  id: string
  persona?: Persona
  messages?: ChatMessage[]
}

export interface ChatSidebarProps {
  isActive?: boolean
  chatList?: Chat[]
  currentChatId?: string
  onChangeChat?: (chat: Chat) => void
  onCloseChat?: (chat: Chat) => void
  onNewChat?: (persona: Persona) => void
  onSettings?: () => void
}
