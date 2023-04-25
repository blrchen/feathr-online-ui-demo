import { Prompt } from '@/components/ChatGPT/interface'
import { Form, Input, Modal } from 'antd'
import React, { useEffect } from 'react'

export interface PromptModalProps {
  show?: boolean
  data?: Prompt
  onSubmit?: (value: Prompt) => void
  onCancel?: () => void
}

const PromptModal = (props: PromptModalProps) => {
  const [form] = Form.useForm()
  const { show, data, onSubmit, onCancel } = props

  const onOk = () => {
    form.submit()
  }

  const onFinish = (values: Prompt) => {
    onSubmit?.(values)
  }

  useEffect(() => {
    if (show) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
  }, [show])

  return (
    <Modal title="Prompt" open={show} onOk={onOk} onCancel={onCancel}>
      <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Content" name="content">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PromptModal
