import { ChatRole, Prompt } from '@/components/ChatGPT/interface'
import { Form, Input, Select, Modal } from 'antd'
import React, { useEffect } from 'react'
import { Persona } from '../ChatSidebar/interface'

export interface PromptModalProps {
  show?: boolean
  data?: Persona
  onSubmit?: (value: Persona) => void
  onCancel?: () => void
}

const PersonaModal = (props: PromptModalProps) => {
  const [form] = Form.useForm()
  const { show, data, onSubmit, onCancel } = props

  const onOk = () => {
    form.submit()
  }

  const onFinish = (values: Persona) => {
    onSubmit?.(values)
  }

  useEffect(() => {
    if (show) {
      form.setFieldsValue(data || {})
    } else {
      form.resetFields()
    }
  }, [show])

  return (
    <Modal title="Persona" open={show} onOk={onOk} onCancel={onCancel} getContainer={false}>
      <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select the role!' }]}
        >
          <Select options={Object.values(ChatRole).map((item) => ({ label: item, value: item }))} />
        </Form.Item>
        <Form.Item label="Prompt" name="prompt">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PersonaModal
