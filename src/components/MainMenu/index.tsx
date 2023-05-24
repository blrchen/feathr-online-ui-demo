import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import cs from 'classnames'
import { Menu, MenuProps } from 'antd'
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons'

import styles from './index.module.less'

export interface MainMenuProps {
  style?: React.CSSProperties
  className?: string
  theme?: MenuProps['theme']
  mode?: MenuProps['mode']
}

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>
  },
  {
    key: '/chat',
    icon: <EnvironmentOutlined />,
    label: <Link to="/chat">Chat</Link>
  },
  {
    key: '/lookup',
    icon: <EnvironmentOutlined />,
    label: <Link to="/lookup">Lookup</Link>
  },
  {
    key: '/local-compute',
    icon: <EnvironmentOutlined />,
    label: <Link to="/local-compute">LocalCompute</Link>
  },
  {
    key: '/invoke-external-api',
    icon: <EnvironmentOutlined />,
    label: <Link to="/invoke-external-api">ExternalAPI</Link>
  },
  {
    key: '/aggregation',
    icon: <EnvironmentOutlined />,
    label: <Link to="/aggregation">Aggregation</Link>
  },
  {
    key: '/model-service',
    icon: <EnvironmentOutlined />,
    label: <Link to="/model-service">Inference</Link>
  }
]

const getMenuKey = (pathname: string) => {
  return pathname
}

const MainMenu = (props: MainMenuProps) => {
  const { style, className, theme, mode = 'inline' } = props

  const location = useLocation()

  const [current, setcurrent] = useState<string>(getMenuKey(location.pathname))

  useEffect(() => {
    setcurrent(getMenuKey(location.pathname))
  }, [location.pathname])

  return (
    <Menu
      style={style}
      className={cs(styles.menu, className)}
      items={menuItems}
      theme={theme}
      mode={mode}
      selectedKeys={[current]}
    />
  )
}

export default MainMenu
