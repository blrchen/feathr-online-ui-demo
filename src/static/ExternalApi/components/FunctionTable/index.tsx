import React, { useState } from 'react'

import { Card } from 'antd'

const tabList = [
  {
    key: 'geoip_demo',
    tab: 'geoip_demo'
  }
]

const contentList: Record<string, React.ReactNode> = {
  geoip_demo: (
    <pre>
      <code>{'geoip_demo(ip as string)'}</code>
      <br />
      <code>{'| lookup country as string, city as string from geoip on ip'}</code>
      <br />
      <code>{';'}</code>
    </pre>
  )
}

const FunctionTable = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>('geoip_demo')
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key)
  }

  return (
    <>
      <Card
        extra={<a href="https://github.com/windoze/transformer/blob/main/test/test.conf">More</a>}
        style={{ width: '100%' }}
        title="Function Definition"
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={(key) => {
          onTab1Change(key)
        }}
      >
        {contentList[activeTabKey1]}
      </Card>
    </>
  )
}

export default FunctionTable
