import type { MutableRefObject, ReactNode, RefObject } from 'react'

export enum ChatRole {
  Assistant = 'assistant',
  User = 'user',
  System = 'system'
}
export enum ChatGPTVersion {
  GPT_35_turbo = 'gpt-35-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_32K = 'gpt-4-32k'
}

export interface Prompt {
  title?: string
  content?: string
}

export interface ChatGPTProps {
  fetchPath: string
  version: ChatGPTVersion
  prompts?: Prompt[]
  onSettings?: () => void
  onChangeVersion?: (version: ChatGPTVersion) => void
}

export interface ChatMessage {
  content: string
  role: ChatRole
}

export interface ChatMessageItemProps {
  message: ChatMessage
}

export interface SendBarProps {
  loading: boolean
  disabled: boolean
  inputRef: RefObject<HTMLTextAreaElement>
  onSettings?: () => void
  onSend: (message: ChatMessage) => void
  onClear: () => void
  onStop: () => void
}

export interface ShowProps {
  loading?: boolean
  fallback?: ReactNode
  children?: ReactNode
}
