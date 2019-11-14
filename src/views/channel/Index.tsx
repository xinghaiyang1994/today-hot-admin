import React, { useState, useEffect, lazy }  from 'react'
import { Divider, message } from 'antd'
import {
  getChannelList,
  getChannelDetail,
  postChannelOpenCtrl,
  postChannelMutiUpdate,
} from '../../api/actions'
const Head = lazy(() => import('./Head'))
const List = lazy(() => import('./List'))
const Alert = lazy(() => import('./Alert'))

const pageSize: number = 10
let openOk: boolean = true
const formItem = {
  name: '',
  domain: '',
  charset: '',
  cookie: '',
  hotUrl: '',
  isUseUserAgent: false,
  isOpen: false,
  isSpa: true,
  listDom: '',
  listSpecialMethod: '',
  listTitleDom: '',
  listUrlDom: '',
  listUrlRule: '',
  sort: ''
}

const Channel: React.FC = (props: any) => {
  // 列表
  const [list, setList] = useState([])

  // 分页
  const [pageCurrent, setPageCurrent] = useState(1)
  const [total, setTotal] = useState(0)
  
  const chgPage = (pageInfo: any) => {
    console.log(pageInfo)
    setPageCurrent(pageInfo.current)
  }

  // 获取列表
  const getList = () => {
    let data = {
      page: pageCurrent,
      pageSize
    }
    console.log('查询', data)
    getChannelList(data).then(res => {
      let resData = res.data
      const list = resData.list

      // 非第一个页删除最后一个元素
      if (list.length === 0 && pageCurrent > 1) {
        return setPageCurrent(pageCurrent - 1)
      } 

      list.forEach((el: any) => {
        el.key = el.id
        el.loading = false
      })
      setList(list)
      setTotal(resData.total)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getList()
  }, [pageCurrent])

  // 开关
  const chgOpen = (status: boolean, item: any, index: number) => {
    if (!openOk) {
      return
    }
    openOk = false

    setList((list: any) => {
      const nList = list.map((el: any, i: number) => {
        if (i === index) {
          el.loading = true
        }
        return el
      })
      return nList
    })

    postChannelOpenCtrl({
      id: item.id,
      isOpen: status ? 1 : 0
    }).then(() => {
      setList((list: any) => {
        const nList = list.map((el: any, i: number) => {
          if (i === index) {
            el.loading = false
            el.isOpen = status ? 1 : 0
          }
          return el
        })
        return nList
      })

      openOk = true
      message.success('修改成功')
    }).catch(err => {
      setList((list: any) => {
        const nList = list.map((el: any, i: number) => {
          if (i === index) {
            el.loading = false
          }
          return el
        })
        return nList
      })
      openOk = true
      console.log(err)
    })
  }

  // 批量选择
  const [selectedRow, setSelectedRow] = useState([])
  const [mutiUpdateLoading, setMutiUpdateLoading] = useState(false)
  const rowSelection = {
    selectedRowKeys: selectedRow,
    onChange(arr: any) {
      console.log(arr)
      setSelectedRow(arr)
    }
  }
  const mutiUpdate = () => {
    setMutiUpdateLoading(true)
    console.log(selectedRow)
    postChannelMutiUpdate({
      type: 'muti',
      list: selectedRow
    }).then((res: any) => {
      setMutiUpdateLoading(false)
      message.success(res.message)
    }).catch(err => {
      setMutiUpdateLoading(false)
      console.log(err)
    })
  }

  // 全部更新
  const [allUpdateLoading, setAllUpdateLoading] = useState(false)
  const allUpdate = () => {
    setAllUpdateLoading(true)
    postChannelMutiUpdate({
      type: 'all'
    }).then((res: any) => {
      setAllUpdateLoading(false)
      message.success(res.message)
    }).catch(err => {
      setAllUpdateLoading(false)
      console.log(err)
    })
  }

  // 打开新增
  const openNewDialog = () => {
    setForm(JSON.parse(JSON.stringify(formItem)))
    setIsModify(false)
    setShowDialog(true)
  }

  // 弹窗
  const [showDialog, setShowDialog] = useState(false)

  // 展示详情
  const showDetail = (item: any) => {
    getChannelDetail({
      id: item.id
    }).then(res => {
      let resData = res.data
      let form = dealDataToForm(resData)
      console.log(form)
      setForm(form)
      setModifyId(form.id)
      setIsModify(true)
      setShowDialog(true)
    }).catch(err => {
      console.log(err)
    })
  }
  const dealDataToForm = (resData: any) => {
    let data = JSON.parse(JSON.stringify(resData))
    data.isOpen = !!resData.isOpen
    data.isSpa = !!resData.isSpa
    data.isUseUserAgent = !!resData.isUseUserAgent
    data.sort = resData.sort + ''
    return data
  }
  
  // 表单
  const [isModify, setIsModify] = useState(false)
  const [modifyId, setModifyId] = useState('')
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formItem)))


  return (
    <div>
      <Head 
        allUpdate={allUpdate}
        allUpdateLoading={allUpdateLoading}
        mutiUpdate={mutiUpdate}
        mutiUpdateLoading={mutiUpdateLoading}
        selectedRow={selectedRow}
        openNewDialog={openNewDialog}
       />
      <Divider />
      {/* 列表 */}
      <List 
        chgPage={chgPage}
        rowSelection={rowSelection}
        list={list}
        pageCurrent={pageCurrent}
        pageSize={pageSize}
        total={total}
        chgOpen={chgOpen}
        showDetail={showDetail}
        getList={getList}
       />
      {/* 弹出框 */}
      <Alert
        ownForm={form}
        isModify={isModify}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        modifyId={modifyId}
        getList={getList}
       />
    </div>
  )
}

export default Channel