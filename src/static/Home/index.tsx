import React from 'react'

import { Descriptions } from 'antd'

import { observer } from '@/hooks'

const Home = () => {
  return (
    <div>
      <Descriptions bordered title="Demo List">
        <Descriptions.Item label="Lookup Store" span={10}>
          Invoke arbitrary external JSON-based HTTP API. (Public Service)
        </Descriptions.Item>
        <Descriptions.Item label="Local Compute" span={10}>
          Expression engine with extensible functions for local computation.
        </Descriptions.Item>
        <Descriptions.Item label="Invoke API" span={10}>
          Invoke arbitrary external JSON-based HTTP API. (Same Data Center)
        </Descriptions.Item>
        <Descriptions.Item label="Aggregation" span={10}>
          Based on Feathr NYC Taxi Sample: <br />- Look up Average Fare and Max Fare based on
          Location ID from Feathr Online Store; <br />- Look up Location Name from Map API deployed
          in the same data center; <br />- Calculate Trip Distance and Speed with Mathematic
          Calculation;
        </Descriptions.Item>
        <Descriptions.Item label="Inference">
          Get movie recommendation from model service
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default observer(Home)
