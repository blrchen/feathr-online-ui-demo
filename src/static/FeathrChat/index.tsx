import React, { useEffect, useRef } from 'react'

import ChatGPT from '@/components/ChatGPT'
import PagePanel from '@/components/PagePanel'
import { observer } from '@/hooks'

const LocalCompute = () => {
  return (
    <PagePanel title="Feathr Chart">
      <ChatGPT fetchPath="/api/chat-completion" />
    </PagePanel>
  )
}

export default observer(LocalCompute)
