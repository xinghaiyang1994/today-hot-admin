import { GET_USER_INFO } from './action-type'
import { getUserInfo } from '../api/actions'

function chgInfo(state: any) {
  return {
    type: GET_USER_INFO,
    state
  }
}

function getInfo() {
  return (dispatch: any, getState: any) => {
    // 异步操作
    getUserInfo().then(res => {
      console.log(res)
      let resData = res.data
      dispatch(chgInfo(resData))
    }).catch(err => {
      console.log(err)
    })
  }
}

export {
  chgInfo,
  getInfo
}