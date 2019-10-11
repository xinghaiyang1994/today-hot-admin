// 暂时还未配置环境变量 CURRENT_ENV
const CURRENT_ENV = 'dev'
const URL = {
  // 本地环境
  dev: {
    business: ''
  }, 
  // 测试环境
  test: {
    business: ''
  }, 
  // 沙箱环境
  box: {
    business: ''
  }, 
  // 正式环境
  prod: {
    business: ''
  }
}
const DOMAIN = URL[CURRENT_ENV]

const API = {
  TEST_URL: `${DOMAIN.business}/test`,   // 测试
}

export default API
