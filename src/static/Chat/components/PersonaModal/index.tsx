import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Form,
  Input,
  Select,
  Modal,
  Tabs,
  Upload,
  UploadProps,
  UploadFile,
  Spin,
  Checkbox
} from 'antd'
import { ChatRole, Prompt } from '@/components/ChatGPT/interface'
import axios from 'axios'
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'

import GlobalContext from '@/contexts/globalContext'

import { Persona } from '../ChatSidebar/interface'

export interface PromptModalProps {
  show?: boolean
  data?: Persona
  onSubmit?: (value: Persona) => void
  onCancel?: () => void
}

export type PersonaForm = Persona & { active?: boolean }

const { Dragger } = Upload

const PersonaModal = (props: PromptModalProps) => {
  const { visitorId } = useContext(GlobalContext)

  const [form] = Form.useForm()
  const [uploadForm] = Form.useForm()
  const { show, data, onSubmit, onCancel } = props
  const [tabKey, setTabKey] = useState('normal')
  const [isUploading, setIsUploading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onOk = () => {
    if (tabKey === 'normal') {
      form.submit()
    } else {
      uploadForm.submit()
    }
  }

  const onFinish = (values: PersonaForm) => {
    values.role = ChatRole.System
    if (tabKey === 'normal') {
      onSubmit?.(values)
    } else {
      uploadFiles(values)
    }
  }

  const onTabChage = (activeKey: string) => {
    setTabKey(activeKey)
  }

  const beforeUpload = () => {
    return false
  }

  const onChangeDragger: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList)
  }

  const uploadFiles = async (values: PersonaForm) => {
    if (fileList.length > 0) {
      setIsUploading(true)
      let formData = new FormData()
      formData.append('visitorId', visitorId?.current!)

      fileList.forEach((file) => {
        formData.append('files', file.originFileObj!)
      })

      try {
        const { data } = await axios<any>({
          method: 'POST',
          url: '/api/uploadFiles',
          data: formData,
          timeout: 1000 * 60 * 5
          // onUploadProgress(progress) {
          // const percent = (progress.loaded / (progress.total || 0)) * 100
          // setFileList((list) => {
          //   return list.map((item) => {
          //     return { ...item, percent }
          //   })
          // })
          // }
        })

        setFileList([])
        values.doc = data
        onSubmit?.(values)
      } catch {
      } finally {
        setIsUploading(false)
      }
    }
  }

  const getTabItems = () => {
    const normalItem = {
      label: `Normal`,
      key: 'normal',
      children: (
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Prompt" name="prompt">
            <Input.TextArea />
          </Form.Item>
          {!data && (
            <Form.Item name="active" valuePropName="checked">
              <Checkbox>Auto Active</Checkbox>
            </Form.Item>
          )}
        </Form>
      )
    }
    const pdfItme = {
      label: `PDF Files`,
      key: 'pdf',
      children: (
        <Form form={uploadForm} name="basic" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Dragger
              accept=".pdf,application/pdf"
              multiple
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={onChangeDragger}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data
                or other band files
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item name="active">
            <Checkbox>Auto Active</Checkbox>
          </Form.Item>
        </Form>
      )
    }
    if (data) {
      return [normalItem]
    } else {
      return [normalItem, pdfItme]
    }
  }

  useEffect(() => {
    if (show) {
      if (data?.doc) {
        setTabKey('pdf')
        uploadForm.setFieldValue('name', data.name)
      } else {
        setTabKey('normal')
        form.setFieldsValue(data || {})
      }
    } else {
      form.resetFields()
      uploadForm.resetFields()
    }
  }, [show])

  return (
    <Modal
      title="Persona"
      open={show}
      onOk={onOk}
      onCancel={onCancel}
      forceRender
      getContainer={false}
    >
      <Spin
        spinning={isUploading}
        tip="Loading..."
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Tabs
          activeKey={tabKey}
          centered
          onChange={onTabChage}
          style={{ marginTop: -16 }}
          items={getTabItems()}
        />
      </Spin>
    </Modal>
  )
}

export default PersonaModal
