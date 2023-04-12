import React, { useState } from 'react'

import { Card } from 'antd'

const tabList = [
  {
    key: 'local_compute',
    tab: 'local_compute'
  }
]

const contentList: Record<string, React.ReactNode> = {
  local_compute: (
    <pre>
      <code>
        {
          'nyc_taxi_demo_3_local_compute(pu_loc_id as int, do_loc_id as int, pu_time as string, do_time as string, trip_distance as double, fare_amount as double)'
        }
      </code>
      <br />
      <code>
        {
          '| project duration_second = (timestamp(do_time, "%Y/%-m/%-d %-H:%-M") - timestamp(pu_time, "%Y/%-m/%-d %-H:%-M"))'
        }
      </code>
      <br />
      <code>{'| project speed_mph = trip_distance * 3600 / duration_second'}</code>
      <br />
      <code>{';'}</code>
    </pre>
  )
}

const FunctionTable = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>('local_compute')
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
