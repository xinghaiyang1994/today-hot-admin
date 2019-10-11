import Config from '../views/Config'
import Channel from '../views/Channel'

const routes = [
  {
    path: '/',    // 路径
    exact: true,    // 是否严格匹配
    component: Channel    // 组件
  },
  {
    path: '/config',
    component: Config
  }
]

export default routes