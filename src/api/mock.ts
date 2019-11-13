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


export {
}