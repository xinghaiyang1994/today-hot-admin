import React, { useEffect } from 'react'
import { Layout, Menu, Icon, Dropdown, message } from 'antd'
import { renderRoutes } from 'react-router-config'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style/App.module.scss'
import routes from './router' 
import API from './api/index' 
import { postUserLogout } from './api/actions'
import { getInfo, chgInfo } from './store/action'

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
    name: '失败',
    path: '/fail',    // 路径
    icon: 'file-unknown'
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
  const { location, dispatch, info } = props

  // 获取信息
  useEffect(() => {
    dispatch(getInfo())
  }, [])

  // 退出
  const logout = () => {
    postUserLogout().then(res => {
      console.log(res)
      message.success('退出成功')
      dispatch(chgInfo(JSON.parse(JSON.stringify(infoItem))))
      window.location.href = `${API.USER_LOGIN}?from=${encodeURIComponent(window.location.href)}`
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
    <Layout className={styles['app-index']}>
      {/* 头部 */}
      <Header className="clearfix">
        <div className={`${styles['ai-name']} topic fl`}>管理</div>
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
      <Layout className={styles['ai-main']}>
        {/* 侧边栏 */}
        <Sider width={200} className={styles['ai-side']}>
          <Menu
            className={styles['ai-menu']}
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
        <Layout className={styles['ai-content']}>
          <Content className={styles['ai-content-main']}>
            {renderRoutes(routes)}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = (state: any) => ({
  info: state.reducerInfo
})
export default connect(mapStateToProps)(withRouter(App))
