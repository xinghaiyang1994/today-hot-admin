import React from 'react'
import { Layout, Menu, Icon, Dropdown } from 'antd'
import { renderRoutes } from 'react-router-config'
import { Link, withRouter } from 'react-router-dom'
import routes from './router' 

const { Header, Content, Sider } = Layout

// 头部右侧下拉
const menu = (
  <Menu>
    <Menu.Item>
      <div>退出</div>
    </Menu.Item>
  </Menu>
)

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

const App: React.FC = (props: any) => {
  const { location } = props
  return (
    <Layout>
      {/* 头部 */}
      <Header className="clearfix">
        <div className="topic fl" style={{
          fontSize: '24px'
        }}>管理</div>
        <div className="topic fr">
          <Dropdown overlay={menu}>
            <div className="ant-dropdown-link">
              小李<Icon type="down" />
            </div>
          </Dropdown>
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
              background: '#fff',
              padding: 24,
              marginTop: 20,
              minHeight: 280,
            }}>
            <div>{renderRoutes(routes)}</div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default withRouter(App)
