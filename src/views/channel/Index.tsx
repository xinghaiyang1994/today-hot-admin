import React, { useState, useEffect }  from 'react'
import { Button, Divider, Modal, Form, message } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import styled from 'styled-components'
import ChannelList from './ChannelList'
import ChannelAlert from './ChannelAlert'

import { 
  CHANNEL_LIST,
  CHANNEL_DETAIL,
  CHANNEL_OPEN_CTRL,
  CHANNEL_OPERATE,
  CHANNEL_DELETE,
  CHANNEL_MUTI_REFRESH
} from '../../api/graphType' 

const ChannelIndex = styled.div`
  height: 100%;
`

const pageSize = 10
let openOk: boolean = true
let submitOk: boolean = true
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
  // 列表分页相关
  const [list, setList] = useState([])
  const [pageCurrent, setPageCurrent] = useState(1)
  const [total, setTotal] = useState(0)
  const { loading: channelListLoading, refetch: getChannelList } = useQuery(CHANNEL_LIST)

  const getList = async () => {
    let res = await getChannelList({
      pageSize,
      current: pageCurrent
    })
    const { total, list } = res.data.channelList

    if (list.length === 0 && pageCurrent > 1) {
      setPageCurrent(pageCurrent - 1)
    }

    const nList = JSON.parse(JSON.stringify(list))
    nList.forEach((el: any) => {
      el.key = el.id
      el.loading = false
    })
    setList(nList)
    setTotal(total)
  }
  const chgPage = (pageInfo: any) => {
    setPageCurrent(pageInfo.current)
    setSelectedRow([])
  }
  useEffect(() => {
    getList()
  }, [pageCurrent])

  // 开关
  const [chgChannelOpenCtrl] = useMutation(CHANNEL_OPEN_CTRL)
  const chgOpen = async (item: any, index: number) => {
    if (!openOk) {
      return
    }
    openOk = false

    setList((list: any) => {
      let nList = list.map((el: any, i: number) => {
        if (i === index) {
          el.loading = true
        }
        return el
      })
      return nList
    })

    let res = await chgChannelOpenCtrl({
      variables: {
        id: item.id,
        isOpen: item.isOpen === 1 ? 0 : 1
      }
    })

    const { id, isOpen } = res.data.channelOpenCtrl
    console.log(id, isOpen)
    setList((list: any) => {
      let nList = list.map((el: any) => {
        if (el.id === id) {
          el.loading = false
          el.isOpen = isOpen
        }
        return el
      })
      return nList
    })

    openOk = true
    message.success('修改成功')
  }

  // 删除单个
  const [delChannel] = useMutation(CHANNEL_DELETE)
  const deleteChannel = (item: any) => {
    console.log(item)
    Modal.confirm({
      title: '删除',
      content: `确定删除 ${item.name} 渠道?`,
      async onOk() {
        await delChannel({
          variables: {
            id: item.id
          }
        })
        message.success('删除成功')
        getList()
      },
      onCancel() {}
    })
  }

  // 批量选择
  const [mutiRefreshChannel] = useMutation(CHANNEL_MUTI_REFRESH)
  const [selectedRow, setSelectedRow] = useState([])
  const [mutiUpdateLoading, setMutiUpdateLoading] = useState(false)

  const rowSelection = {
    selectedRowKeys: selectedRow,
    onChange(arr: any) {
      console.log(arr)
      setSelectedRow(arr)
    }
  }
  const mutiUpdate = async () => {
    setMutiUpdateLoading(true)
    const { data: { channelMutiRefresh: res }} = await mutiRefreshChannel({
      variables: {
        type: 'muti',
        channelList: selectedRow
      }
    })
    if (res.code === 0) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
    setMutiUpdateLoading(false)
  }

  // 全部更新
  const [allUpdateLoading, setAllUpdateLoading] = useState(false)
  const allUpdate = async () => {
    setAllUpdateLoading(true)
    const { data: { channelMutiRefresh: res }} = await mutiRefreshChannel({
      variables: {
        type: 'all'
      }
    })
    if (res.code === 0) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
    setAllUpdateLoading(false)
  }

  // 展示详情表单
  const [showDialog, setShowDialog] = useState(false)
  const [isModify, setIsModify] = useState(false)
  const [modifyId, setModifyId] = useState(undefined)
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formItem)))
  const { getFieldDecorator } = props.form
  const { refetch: getChannelDetail } = useQuery(CHANNEL_DETAIL)
  const [chgChannelOperate, { data: channelOperateData }] = useMutation(CHANNEL_OPERATE)
  
  const showDetail = async (item: any) => {
    let res = await getChannelDetail({
      id: item.id
    })
    updateForm(false, res.data.channelDetail)
  }
  const dealDataToForm = (resData: any) => {
    let data = JSON.parse(JSON.stringify(resData))
    data.isOpen = !!resData.isOpen
    data.isSpa = !!resData.isSpa
    data.isUseUserAgent = !!resData.isUseUserAgent
    data.sort = resData.sort + ''
    console.log('获取数据', data)
    setModifyId(data.id)
    return data
  }
  const validateForm = () => {
    
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log(values)
        if (!submitOk) {
          return
        }
        submitOk = false
        isModify ? submitFormModify(values) : submitFormAdd(values)
      }
    })
  }
  const dealForm = (form: any) => {
    const data = JSON.parse(JSON.stringify(form))
    data.isOpen = form.isOpen ? 1 : 0
    data.isUseUserAgent = form.isUseUserAgent ? 1 : 0
    data.isSpa = form.isSpa ? 1 : 0
    data.sort = Number(form.sort)
    console.log('提交转换', data)
    if (isModify) {
      data.id = modifyId
    }
    return data
  }
  const submitFormAdd = (values: object) => {
    let data = dealForm(values)
    console.log(data)
    chgChannelOperate({
      variables: {
        form: data,
        type: 'add'
      }
    })
  }
  useEffect(() => {
    if (channelOperateData && channelOperateData.channelOperate) {
      message.success( isModify ? '修改成功' : '新增成功')
      console.log('ok', channelOperateData)
      setShowDialog(false)
      submitOk = true
      getList()
    }
  }, [channelOperateData])
  const submitFormModify = (values: object) => {
    let data = dealForm(values)
    chgChannelOperate({
      variables: {
        form: data,
        type: 'modify'
      }
    })
  }

  const updateForm = (isNew: boolean, data?: any) => {
    if (isNew) {
      setForm(JSON.parse(JSON.stringify(formItem)))
      setIsModify(false)
      setShowDialog(true)
    } else {
      setForm(dealDataToForm(data))
      setIsModify(true)
      setShowDialog(true)
    }
  }

  return (
    <ChannelIndex className="cm-flex-column">
      <div>
        <div className="clearfix">
          <Button onClick={allUpdate} loading={allUpdateLoading} className="fl mr-20" type="primary">全部更新</Button>
          <Button onClick={mutiUpdate} loading={mutiUpdateLoading} disabled={selectedRow.length === 0} className="fl" type="primary">批量更新</Button>
          <Button onClick={() => { updateForm(true) }} className="fr" type="primary">新增</Button>
        </div>
        <Divider />
      </div>
      <ChannelList 
        channelListLoading={channelListLoading}
        chgPage={chgPage}
        list={list}
        rowSelection={rowSelection}
        pageCurrent={pageCurrent}
        pageSize={pageSize}
        total={total}
        chgOpen={chgOpen}
        showDetail={showDetail}
        deleteChannel={deleteChannel}
        />
      <ChannelAlert 
        isModify={isModify}
        showDialog={showDialog}
        validateForm={validateForm}
        setShowDialog={setShowDialog}
        getFieldDecorator={getFieldDecorator}
        form={form}
      />
    </ChannelIndex>
  )
}

export default Form.create({ name: 'register' })(Channel)