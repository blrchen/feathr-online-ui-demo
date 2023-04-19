import React, { forwardRef } from 'react'

import { ChatGPTProps, ChatRole, Prompt } from './interface'
import MessageItem from './MessageItem'
import SendBar from './SendBar'
import { useChatGPT } from './useChatGPT'

import './index.less'
import 'highlight.js/styles/atom-one-dark.css'

const ChatGPT = (props: ChatGPTProps, ref: any) => {
  const {
    loading,
    disabled,
    messages,
    currentMessage,
    onSettings,
    inputRef,
    onSend,
    onClear,
    onStop
  } = useChatGPT(props, ref)

  return (
    <div className="chat-wrapper">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      {currentMessage.current && (
        <MessageItem message={{ content: currentMessage.current, role: ChatRole.Assistant }} />
      )}
      <SendBar
        loading={loading}
        disabled={disabled}
        inputRef={inputRef}
        onSettings={onSettings}
        onSend={onSend}
        onClear={onClear}
        onStop={onStop}
      />
    </div>
  )
}

export default forwardRef<{ setChatContent: (prompt: Prompt) => void }, ChatGPTProps>(ChatGPT)
