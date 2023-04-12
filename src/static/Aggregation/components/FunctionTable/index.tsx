import React, { useState } from 'react'

import { Card } from 'antd'

const tabList = [
  {
    key: 'nyc_taxi_demo',
    tab: 'nyc_taxi_demo'
  }
]

const contentList: Record<string, React.ReactNode> = {
  nyc_taxi_demo: (
    <pre>
      <code>
        {
          'nyc_taxi_demo(pu_loc_id as int, do_loc_id as int, pu_time as string, do_time as string, trip_distance as double, fare_amount as double)'
        }
      </code>
      <br />
      <code>
        {
          '| lookup pu_loc_avg_fare = f_location_avg_fare, pu_loc_max_fare = f_location_max_fare from feathrci on to_string(pu_loc_id)'
        }
      </code>
      <br />
      <code>
        {
          '| lookup do_loc_avg_fare = f_location_avg_fare, do_loc_max_fare = f_location_max_fare from feathrci on to_string(do_loc_id)'
        }
      </code>
      <br />
      <code>
        {'| lookup pu_loc_name = name as string from locationsvc on to_string(pu_loc_id)'}
      </code>
      <br />
      <code>
        {'| lookup do_loc_name = name as string from locationsvc on to_string(do_loc_id)'}
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
  const [activeTabKey1, setActiveTabKey1] = useState<string>('nyc_taxi_demo')
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
