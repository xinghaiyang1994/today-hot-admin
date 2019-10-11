interface ResData {
  code: number,
  message: string,
  data: any
}

function sleep(fn: (value? : any) => any, time? : number) {
  let sTime = time || 200
  return new Promise(function (resolve: (value: ResData) => any, reject) {
    setTimeout(() => {
      resolve(fn())
    }, sTime)
  })
}

function postTest(data?: any) {
  return sleep(() => {
    // console.log(data)111 
    const res = {
      code: 0,
      message	: '数据请求成功',
      data: {
        id: 1
      }
    }
    return res
  }, 2000)
}

function getChannelList(data?: any) {
  return sleep(() => {
    // console.log(data)111 
    const res = {
      code: 0,
      message	: '数据请求成功',
      data: {
        list: [
          {
            key: 1,
            id: 1,
            name: 'v2ex最热',
            isOpen: 1,
            sort: 1,
          },
          {
            key: 22,
            id: 3,
            name: 'v2ex最热',
            isOpen: 0,
            sort: 1,
          }
        ],
        total: 50
      }
    }
    return res
  })
}

function getChannelDetail(data?: any) {
  return sleep(() => {
    // console.log(data)111 
    const res = {
      code: 0,
      message	: '数据请求成功',
      data: {
        key: 22,
        id: 3,
        name: 'v2ex最热',
        isOpen: 1,
        sort: 1,
        charset: '',
        cookie: '',
        hotUrl: '',
        isSpa: true,
        listDom: '',
        listSpecialMethod: '',
        listTitleDom: '',
        listUrlDom: '',
        listUrlRule: '',
      }
    }
    return res
  })
}

const postChannelOpenCtrl = postTest 
const postChannelDelete = postTest 
const postChannelMutiUpdate = postTest 
const postChannelAllUpdate = postTest 
const postChannelAdd = postTest 
const postChannelModify = postTest 

export {
  getChannelList,
  postChannelOpenCtrl,
  postChannelDelete,
  postChannelMutiUpdate,
  postChannelAllUpdate,
  getChannelDetail,
  postChannelAdd,
  postChannelModify
}