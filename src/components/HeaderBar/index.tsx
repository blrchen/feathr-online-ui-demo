import React from 'react'

import { CompressOutlined, ExpandOutlined, GithubOutlined } from '@ant-design/icons'
import { Layout, Space, Typography } from 'antd'

import { useFullScreen } from '@/hooks'

import styles from './index.module.less'

const { Link } = Typography

const { Header } = Layout

const HeaderBar = () => {
  const { fullScreen, toggleFullScreen } = useFullScreen()

  return (
    <>
      <Header className={styles.header}>
        <div className={styles.logoBar}>
          <Link href="/">
            <img alt="logo" src="/logo200.png" />
            <h1>Feathr Demo</h1>
          </Link>
        </div>
        <Space className={styles.right} size={0}>
          <span className={styles.action} onClick={toggleFullScreen}>
            {fullScreen ? (
              <CompressOutlined style={{ fontSize: 16 }} />
            ) : (
              <ExpandOutlined style={{ fontSize: 16 }} />
            )}
          </span>
          <span className={styles.right}>
            <Link
              className={styles.action}
              href="https://github.com/blrchen/feathr-online-ui-demo"
              target="_blank"
            >
              <GithubOutlined />
            </Link>
          </span>
        </Space>
      </Header>
      <div className={styles.vacancy} />
    </>
  )
}

export default HeaderBar
