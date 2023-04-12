import React from 'react'

import { Button, Form, Select } from 'antd'

export interface ExecuteFormProps {
  onSubmit?: (value: any) => void
}

const { Item } = Form

const ExecuteForm = (porps: ExecuteFormProps) => {
  const [form] = Form.useForm()

  const { onSubmit } = porps

  return (
    <Form form={form} layout="inline" onFinish={onSubmit}>
      <Item
        label="Functions"
        name="functions"
        rules={[{ required: true, message: 'Please select Functions!' }]}
      >
        <Select
          options={[
            {
              value: 'nyc_taxi_demo_3_local_compute',
              label: 'local_compute'
            }
          ]}
          mode="multiple"
          style={{ width: 350 }}
        />
      </Item>
      <Item>
        <Button type="primary" htmlType="submit">
          Execute
        </Button>
      </Item>
    </Form>
  )
}

export default ExecuteForm
