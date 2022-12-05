import React from 'react'

import { CompressOutlined, ExpandOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Space, Dropdown, Avatar } from 'antd'
import { Link } from 'react-router-dom'

import { useFullScreen } from '@/hooks'

import styles from './index.module.less'
const { Header } = Layout

const HeaderBar = () => {
  const { fullScreen, toggleFullScreen } = useFullScreen()

  return (
    <>
      <Header className={styles.header}>
        <div className={styles.logoBar}>
          <Link to="/">
            <img alt="logo" src="/logo200.png" />
            <h1>Feathr Online Server Demo</h1>
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
          <Dropdown
            menu={{
              className: styles.menu,
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout'
                }
              ]
            }}
            placement="bottomLeft"
          >
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                className={styles.avatar}
                icon={<UserOutlined />}
                size="small"
                // src={`data:image/png;base64,${account?.idTokenClaims?.aio}`}
              />
              <span>user@test.com</span>
            </span>
          </Dropdown>
        </Space>
      </Header>
      <div className={styles.vacancy} />
    </>
  )
}

export default HeaderBar
