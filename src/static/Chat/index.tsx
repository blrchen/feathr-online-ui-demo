import React, { useEffect, useRef, useState } from 'react'
import { Divider, Drawer, Select, Space, Typography } from 'antd'

import ChatGPT from '@/components/ChatGPT'
import {
  ChatGPInstance,
  ChatGPTVersion,
  ChatMessage,
  ChatRole
} from '@/components/ChatGPT/interface'
import { observer } from '@/hooks'

import ChatSidebar from './components/ChatSidebar'
import { Chat, Persona } from './components/ChatSidebar/interface'

import styles from './index.module.less'
import { MenuOutlined } from '@ant-design/icons'

const { Text, Link } = Typography

const LocalCompute = () => {
  const chatRef = useRef<ChatGPInstance>(null)
  const messagesMap = useRef<WeakMap<Persona, ChatMessage[]>>(new WeakMap<Persona, ChatMessage[]>())

  const [isActive, setIsActive] = useState(false)
  const [chatList, setChatList] = useState<Chat[]>([])
  const [prompts, setPrompts] = useState<ChatMessage[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>()
  const [chatGPTVersion, setChatGPTVersion] = useState<ChatGPTVersion>(ChatGPTVersion.GPT_35_turbo)
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const saveMessages = () => {
    if (currentChat) {
      messagesMap.current.set(currentChat.persona!, chatRef.current?.getMessages() || [])
    }
  }

  const onNewChat = (persona: Persona) => {
    const id = `chat_id_${Date.now()}`
    const messages: ChatMessage[] = []
    const newChat: Chat = {
      id,
      persona: persona
    }
    messagesMap.current.set(persona, messages)
    chatRef.current?.setMessages(messages)
    setIsActive(false)
    saveMessages()
    setPrompts([{ content: persona.prompt || '', role: persona.role! }])
    setCurrentChat(newChat)
    setChatList((state) => {
      return [...state, newChat]
    })
  }

  const onCloseChat = (chat: Chat) => {
    const index = chatList.findIndex((item) => item.id === chat.id)
    messagesMap.current.delete(chat.persona!)
    chatList.splice(index, 1)
    setChatList([...chatList])
    if (chatList.length && chat.id === currentChat?.id) {
      onChangeChat(chatList[0])
    }
  }

  const onChangeChat = (chat?: Chat) => {
    setIsActive(false)
    saveMessages()
    if (chat) {
      setPrompts([{ content: chat.persona?.prompt || '', role: chat.persona?.role! }])
      setCurrentChat(chat)
      const messages = messagesMap.current.get(chat.persona!)
      chatRef.current?.setMessages(messages || [])
    }
  }

  const onChangeVersion = (version: ChatGPTVersion) => {
    setChatGPTVersion(version)
  }

  const onToggleSideBar = () => {
    setIsActive((state) => {
      return !state
    })
  }

  useEffect(() => {
    const version = localStorage.getItem('chatGPTVersion') as ChatGPTVersion
    setChatGPTVersion(version || ChatGPTVersion.GPT_35_turbo)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.removeAttribute('style')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chatGPTVersion', chatGPTVersion)
  }, [chatGPTVersion])

  return (
    <>
      <div className={styles.chatWrapper}>
        <ChatSidebar
          isActive={isActive}
          chatList={chatList}
          currentChatId={currentChat?.id}
          onNewChat={onNewChat}
          onCloseChat={onCloseChat}
          onChangeChat={onChangeChat}
        />
        <ChatGPT
          header={
            <div className={styles.chatHeader}>
              {currentChat?.persona?.name}
              <Link className={styles.menu} onClick={onToggleSideBar}>
                <MenuOutlined />
              </Link>
            </div>
          }
          doc={currentChat?.persona?.doc}
          ref={chatRef}
          fetchPath="/api/chat-completion"
          prompts={prompts}
          config={{ model: chatGPTVersion, stream: true }}
          onChangeVersion={onChangeVersion}
          onSettings={showDrawer}
        />
      </div>
      <Drawer
        title="Chat Settings"
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <Space size="middle">
          <Text> Chat GPT Version</Text>
          <Select
            style={{ width: 200 }}
            onChange={onChangeVersion}
            value={chatGPTVersion}
            options={Object.values(ChatGPTVersion).map((value) => ({
              value: value,
              label: value
            }))}
          />
        </Space>
        <Divider />
      </Drawer>
    </>
  )
}

export default observer(LocalCompute)
