// 暂时还未配置环境变量 CURRENT_ENV
const CURRENT_ENV = 'dev'
const URL = {
  // 本地环境
  dev: {
    BUSINESS: '//local.xinghaiyang.com:3100',
    PASSPORT: '//local.xinghaiyang.com:8080'
  }, 
  // 测试环境
  test: {
    BUSINESS: '//local.xinghaiyang.com:3100',
    PASSPORT: '//local.xinghaiyang.com:8080'
  },
  // 正式环境
  prod: {
    BUSINESS: '',
    PASSPORT: '//passport-api.xinghaiyang.com'
  }
}
const DOMAIN = URL[CURRENT_ENV]

const API = {
  // 用户
  USER_INFO: DOMAIN.BUSINESS + '/user/info',   // 登录用户信息
  USER_LOGIN: DOMAIN.PASSPORT + '/login',   // 登录
  USER_LOGOUT: DOMAIN.BUSINESS + '/user/logout',   // 退出

  // 渠道
  CHANNEL_LIST: DOMAIN.BUSINESS + '/channel/list',   // 渠道列表(翻页)
  CHANNEL_DETAIL: DOMAIN.BUSINESS + '/channel/detail',   // 单个渠道详情
  CHANNEL_ADD: DOMAIN.BUSINESS + '/channel/add',   // 新增单个渠道
  CHANNEL_MODIFY: DOMAIN.BUSINESS + '/channel/modify',   // 修改单个渠道
  CHANNEL_OPEN_CTRL: DOMAIN.BUSINESS + '/channel/openCtrl',   // 修改单个渠道
  CHANNEL_DELETE: DOMAIN.BUSINESS + '/channel/delete',   // 删除单个渠道
  CHANNEL_MUTI_UPDATE: DOMAIN.BUSINESS + '/channel/mutiUpdate',   // 多个渠道重新抓取
  
  // 失败
  FAIL_LIST: DOMAIN.BUSINESS + '/fail/list',   // 失败渠道列表(翻页)
  FAIL_REFRESH_ALL: DOMAIN.BUSINESS + '/fail/refreshAll',   // 重新抓取所有


  // 配置
  CONFIG_ALL: DOMAIN.BUSINESS + '/config/all',   // 所有配置列表
  CONFIG_ALL_MODIFY: DOMAIN.BUSINESS + '/config/modify',   // 修改所有配置列表

}

export default API
