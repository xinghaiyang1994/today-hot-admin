import React, { useState, useEffect } from 'react'
import { Layout, Menu, Icon, Dropdown, message } from 'antd'
import { renderRoutes } from 'react-router-config'
import { Link, withRouter } from 'react-router-dom'
import routes from './router' 
import { getUserInfo, postUserLogout } from './api/actions'

const { Header, Content, Sider } = Layout

interface Info {
  id: number | string
  name: string
}

// 左侧菜单
const nav = [
  {
    name: '渠道',
    path: '/',    // 路径
    icon: 'database'
  },
  {
    name: '配置',
    path: '/config',
    icon: 'setting'
  }
]

const infoItem: Info = {
  id: '',
  name: ''
}

const App: React.FC = (props: any) => {
  const { location } = props

  // 获取信息
  const [info, setInfo] = useState(JSON.parse(JSON.stringify(infoItem)))
  useEffect(() => {
    getUserInfo().then(res => {
      console.log(res)
      let resData = res.data
      setInfo(resData)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  // 退出
  const logout = () => {
    postUserLogout().then(res => {
      console.log(res)
      message.success('退出成功')
      setInfo(JSON.parse(JSON.stringify(infoItem)))
    }).catch(err => {
      console.log(err)
    })
    
  }

  // 头部右侧下拉
  const menu = (
    <Menu>
      <Menu.Item>
        <div onClick={logout}>退出</div>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      {/* 头部 */}
      <Header className="clearfix">
        <div className="topic fl" style={{
          fontSize: '24px'
        }}>管理</div>
        <div className="topic fr">
          {
            info.id && (
              <Dropdown overlay={menu}>
                <div className="ant-dropdown-link">
                  {info.name}<Icon type="down" />
                </div>
              </Dropdown>
            )
          }
        </div>
      </Header>
      <Layout>
        {/* 侧边栏 */}
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            style={{
              borderRight: 'none'
            }}
            defaultSelectedKeys={[location.pathname]}>
            {
              nav.map(el => {
                return (
                  <Menu.Item key={el.path}>
                    <Link to={el.path}>
                      <Icon type={el.icon} />
                      <span>{el.name}</span>
                    </Link>
                  </Menu.Item>
                )
              })
            }
          </Menu>
        </Sider>
        {/* 内容 */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              overflowY: 'auto',
              background: '#fff',
              padding: 24,
              marginTop: 20,
              minHeight: 280,
            }}>
            {renderRoutes(routes)}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default withRouter(App)
