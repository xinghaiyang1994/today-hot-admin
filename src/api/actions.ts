import ajaxInit from 'sea-axios'
import API from './index'
import { message } from 'antd'

const ajax = ajaxInit({
  initTransformResponseFn(res: any) {
    // 网络错误统一处理
    if (res.status !== 200) {
      return console.log('status 非 200', res)
    }
    // 处理 url 中 code 有问题的情况
    if (res.data.code === -2) {
      return window.location.href = `${API.USER_LOGIN}?from=${encodeURIComponent(window.location.href)}`
    }
    // code 非 0 统一处理
    if (res.data.code !== 0) {
      message.error(res.data.message)
      throw new Error(res.data.message)
    }
    return res
  },
  // 无网或者后端报错统一拦截
  initTransformResponseErrorFn(err: any) {
    message.error(err.message)
  }
}) // 默认携带 cookie，按 application/json 方式

function getUserInfo() {
  return ajax({
    url: API.USER_INFO,
    method: 'get'
  })
}

function postUserLogout() {
  return ajax({
    url: API.USER_LOGOUT,
    method: 'post'
  })
}

function getChannelList(data: any) {
  return ajax({
    url: API.CHANNEL_LIST,
    method: 'get',
    data
  })
}

function getChannelDetail(data: any) {
  return ajax({
    url: API.CHANNEL_DETAIL,
    method: 'get',
    data
  })
}

function postChannelAdd(data: any) {
  return ajax({
    url: API.CHANNEL_ADD,
    method: 'post',
    data
  })
}

function postChannelModify(data: any) {
  return ajax({
    url: API.CHANNEL_MODIFY,
    method: 'post',
    data
  })
}

function postChannelOpenCtrl(data: any) {
  return ajax({
    url: API.CHANNEL_OPEN_CTRL,
    method: 'post',
    data
  })
}

function postChannelDelete(data: any) {
  return ajax({
    url: API.CHANNEL_DELETE,
    method: 'post',
    data
  })
}

function postChannelMutiUpdate(data: any) {
  return ajax({
    url: API.CHANNEL_MUTI_UPDATE,
    method: 'post',
    data
  })
}

function getConfigAll() {
  return ajax({
    url: API.CONFIG_ALL,
    method: 'get'
  })
}

function postConfigAllModify(data: any) {
  return ajax({
    url: API.CONFIG_ALL_MODIFY,
    method: 'post',
    data
  })
}

function getFailList(data: any) {
  return ajax({
    url: API.FAIL_LIST,
    method: 'get',
    data
  })
}

function postFailRefreshAll() {
  return ajax({
    url: API.FAIL_REFRESH_ALL,
    method: 'post'
  })
}

export {
  // 用户
  getUserInfo,
  postUserLogout,
  // 渠道
  getChannelList,
  getChannelDetail,
  postChannelAdd,
  postChannelModify,
  postChannelOpenCtrl,
  postChannelDelete,
  postChannelMutiUpdate,
  // 失败
  getFailList,
  postFailRefreshAll,
  // 配置
  getConfigAll,
  postConfigAllModify
}