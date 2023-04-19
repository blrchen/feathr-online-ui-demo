import React, { use, useEffect, useRef, useState } from 'react'

import ChatGPT from '@/components/ChatGPT'
import { ChatGPTVersion, Prompt } from '@/components/ChatGPT/interface'
import PagePanel from '@/components/PagePanel'
import { observer } from '@/hooks'
import { Divider, Drawer, List, Select, Space, Typography } from 'antd'
import PromptModal from './components/PropmtModal'
import { DeleteOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons'

const { Text, Link } = Typography

const LocalCompute = () => {
  const chatRef = useRef<any>(null)
  const currentPromptIndex = useRef<number>(-1)
  const currentPrompt = useRef<Prompt>({})

  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [chatGPTVersion, setChatGPTVersion] = useState<ChatGPTVersion>(ChatGPTVersion.GPT_35_turbo)

  const onChangeVersion = (version: ChatGPTVersion) => {
    setChatGPTVersion(version)
  }

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const onShowModal = (prompt: Prompt, index: number) => {
    currentPrompt.current = { ...prompt }
    currentPromptIndex.current = index
    setIsModalOpen(true)
  }

  const onAddPrompt = () => {
    onShowModal({}, -1)
  }

  const onPromptDelete = (index: number) => {
    setPrompts((state) => {
      state.splice(index, 1)
      return [...state]
    })
  }

  const onModalSubmit = (prompt: Prompt) => {
    setPrompts((state) => {
      if (currentPromptIndex.current === -1) {
        state.push(prompt)
      } else {
        state.splice(currentPromptIndex.current, 1, prompt)
      }
      return [...state]
    })

    setIsModalOpen(false)
  }

  const onModalCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    setPrompts(JSON.parse(localStorage.getItem('prompts') || '[]') as Prompt[])
    const version = localStorage.getItem('chatGPTVersion') as ChatGPTVersion
    setChatGPTVersion(version || ChatGPTVersion.GPT_35_turbo)
  }, [])

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts))
  }, [prompts])

  useEffect(() => {
    localStorage.setItem('chatGPTVersion', chatGPTVersion)
  }, [chatGPTVersion])

  return (
    <PagePanel title="Feathr Chat">
      <ChatGPT
        ref={chatRef}
        fetchPath="/api/chat-completion"
        prompts={prompts}
        version={chatGPTVersion}
        onChangeVersion={onChangeVersion}
        onSettings={showDrawer}
      />
      <Drawer
        title="Chat Settings"
        placement="right"
        closable={true}
        mask={false}
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

        <List
          header={
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text >Prompts</Text>
              <Link onClick={onAddPrompt} style={{ marginRight: 8 }}>
                <PlusOutlined />
              </Link>
            </Space>
          }
          itemLayout="horizontal"
          dataSource={prompts}
          renderItem={(item, index) => (
            <List.Item
              onClick={() => {
                chatRef.current?.setChatContent(item)
              }}
              actions={[
                <Link
                  key="eidt"
                  onClick={(e) => {
                    e.stopPropagation()
                    onShowModal(item, index)
                  }}
                >
                  <FormOutlined />
                </Link>,
                <Link
                  key="delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPromptDelete(index)
                  }}
                >
                  <DeleteOutlined />
                </Link>
              ]}
            >
              <List.Item.Meta title={item.title} description={item.content} />
            </List.Item>
          )}
        />
      </Drawer>
      <PromptModal
        show={isModalOpen}
        data={currentPrompt.current}
        onCancel={onModalCancel}
        onSubmit={onModalSubmit}
      />
    </PagePanel>
  )
}

export default observer(LocalCompute)
