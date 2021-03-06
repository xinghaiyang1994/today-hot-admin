import Config from '../views/Config'
import Channel from '../views/channel/Index'
import Fail from '../views/fail/Index'

const routes = [
  {
    path: '/',    // 路径
    exact: true,    // 是否严格匹配
    component: Channel    // 组件
  },
  {
    path: '/config',
    component: Config
  },
  {
    path: '/fail',
    component: Fail
  }
]

export default routes