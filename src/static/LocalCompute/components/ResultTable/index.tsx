import React from 'react'

import { Card, Descriptions } from 'antd'

import ResizeTable from '@/components/ResizeTable'

export interface ResultTableProps {
  data?: any[]
  loading?: boolean
}

const { Item } = Descriptions

const ResultTable = (props: ResultTableProps) => {
  const { data, loading } = props

  const columns = [
    {
      title: 'Function',
      dataIndex: 'pipeline',
      with: 100
    },
    {
      title: 'Count',
      dataIndex: 'count',
      with: 100
    },
    {
      title: 'Time',
      dataIndex: 'time',
      render: (col: number) => {
        return `${col}ms`
      },
      with: 100
    },
    {
      title: 'Status',
      dataIndex: 'status',
      with: 100
    }
  ]

  return (
    <Card title="Result List" style={{ width: '100%' }} bodyStyle={{ padding: 0 }}>
      <ResizeTable
        expandable={{
          expandedRowRender: ({ data }: { data: any[] }) => {
            return (
              <>
                {data.map((item, index) => {
                  return (
                    <Descriptions key={index}>
                      {Object.keys(item).map((key) => {
                        return (
                          <Item key={key} label={key}>
                            {item[key]}
                          </Item>
                        )
                      })}
                    </Descriptions>
                  )
                })}
              </>
            )
          },
          rowExpandable: (record: any) => {
            return record.status === 'OK' && record.count > 0
          }
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        scroll={{ y: 650 }}
      />
    </Card>
  )
}

export default ResultTable
