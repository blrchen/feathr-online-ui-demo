import React, { useEffect, useRef, useState } from 'react'
import { Avatar, List, Typography, Popconfirm, Collapse, ConfigProvider } from 'antd'

import { ChatSidebarProps, Persona } from './interface'

import {
  CloseCircleOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'

import styles from './index.module.less'
import PersonaModal from '../PersonaModal'
import { ChatRole } from '@/components/ChatGPT/interface'

const DefaultPersona = {
  role: ChatRole.System,
  name: 'Default',
  prompt: 'I am going to teach you a DSL, could you learn it? \n Feathr DSL: \n'
}
const { Panel } = Collapse
const { Link } = Typography

const ChatSidebar = (props: ChatSidebarProps) => {
  const { currentChatId, chatList, onChangeChat, onCloseChat, onSettings, onNewChat } = props

  const currentPersonaIndex = useRef<number>(-1)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentPersona, setCurrentPersona] = useState<Persona | undefined>()

  const onShowPersonaModal = (persona: Persona | undefined, index: number) => {
    currentPersonaIndex.current = index
    setCurrentPersona(persona)
    setShowModal(true)
  }

  const onCancelPersonaModal = () => {
    setShowModal(false)
  }

  const onModalSubmit = (persona: Persona) => {
    setPersonas((state) => {
      if (currentPersonaIndex.current === -1) {
        state.push(persona)
      } else {
        state.splice(currentPersonaIndex.current, 1, persona)
      }
      return [...state]
    })

    setShowModal(false)
  }

  const onNewPersona = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShowPersonaModal(undefined, -1)
  }

  const onDeletePersona = (index: number) => {
    setPersonas((state) => {
      state.splice(index, 1)
      return [...state]
    })
  }

  useEffect(() => {
    setPersonas(JSON.parse(localStorage.getItem('Personas') || '[]') as Persona[])
    onNewChat?.(DefaultPersona)
  }, [])

  useEffect(() => {
    localStorage.setItem('Personas', JSON.stringify(personas))
  }, [personas])

  return (
    <ConfigProvider renderEmpty={() => <></>}>
      <div className={styles.sidebar}>
        <List
          className={styles.chatList}
          itemLayout="horizontal"
          dataSource={chatList}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className={currentChatId === item.id ? styles.selected : undefined}
              actions={[]}
              onClick={() => {
                onChangeChat?.(item)
              }}
            >
              <List.Item.Meta
                className={styles.listMete}
                avatar={<Avatar size={40} src={item.persona?.avatar} />}
                title={
                  <>
                    <span>{item.persona?.name}</span>
                    <div
                      className="close-button"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Popconfirm
                        key="closeChat"
                        placement="right"
                        title="Are you sure to close this chat?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => {
                          onCloseChat?.(item)
                        }}
                      >
                        <Link style={{ fontSize: 14 }}>
                          <CloseCircleOutlined />
                        </Link>
                      </Popconfirm>
                    </div>
                  </>
                }
                description={item.persona?.prompt}
              />
            </List.Item>
          )}
        />

        <Collapse
          defaultActiveKey={['1']}
          bordered={false}
          expandIconPosition="end"
          className={styles.persona}
        >
          <Panel
            header="Persona List"
            key="1"
            extra={
              <Link onClick={onNewPersona}>
                <PlusCircleOutlined />
              </Link>
            }
          >
            <List
              className={styles.list}
              itemLayout="horizontal"
              dataSource={[DefaultPersona, ...personas]}
              renderItem={(item, index) => (
                <List.Item
                  key={index}
                  onClick={() => {
                    onNewChat?.(item)
                  }}
                  actions={
                    index !== 0
                      ? [
                          <Link
                            key="eidt"
                            onClick={(e) => {
                              e.stopPropagation()
                              onShowPersonaModal(item, index)
                            }}
                          >
                            <FormOutlined />
                          </Link>,
                          <Link
                            key="delete"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeletePersona(index)
                            }}
                          >
                            <DeleteOutlined />
                          </Link>
                        ]
                      : []
                  }
                >
                  <List.Item.Meta title={item.name} />
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
      </div>
      <PersonaModal
        show={showModal}
        data={currentPersona}
        onCancel={onCancelPersonaModal}
        onSubmit={onModalSubmit}
      />
    </ConfigProvider>
  )
}

export default ChatSidebar
