import React from 'react'

import { Row } from 'antd'

import PagePanel from '@/components/PagePanel'
import { observer } from '@/hooks'
import MovieList from '@/pages/ModelService/components/MovieList'

const ModelService = () => {
  return (
    <PagePanel title="Model Service" subTitle="Get movie recommendation from model service">
      <Row>
        <MovieList />
      </Row>
    </PagePanel>
  )
}

export default observer(ModelService)
