import React, { ReactNode, useEffect, useRef } from 'react'

import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

import FooterBar from '@/components/FooterBar'
import HeaderBar from '@/components/HeaderBar'
import MainMenu from '@/components/MainMenu'
import GlobalContext from '@/contexts/globalContext'

import styles from './index.module.less'
import { getFinger } from '@/utils/finger'

export interface AppLayoutProps {
  children?: ReactNode
}

const { Content } = Layout

const AppLayout = (props: AppLayoutProps) => {
  const visitorIdRef = useRef<any>()
  const onGlobalSearch = (_value: string) => {
    //
  }

  useEffect(() => {
    getFinger().then((finger) => {
      visitorIdRef.current = finger.visitorId
    })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        onSearch: onGlobalSearch,
        visitorId: visitorIdRef
      }}
    >
      <Layout className={styles.layout}>
        <Layout>
          <HeaderBar className={styles.header}>
            <div className={styles.menuWrapper}>
              <MainMenu theme="dark" mode="horizontal" />
            </div>
          </HeaderBar>
          <Content className={styles.main}>
            <Outlet />
          </Content>
          <FooterBar />
        </Layout>
      </Layout>
    </GlobalContext.Provider>
  )
}

export default AppLayout
