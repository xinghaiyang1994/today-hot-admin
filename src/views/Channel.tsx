import React, { useState, useEffect }  from 'react'
import { Table, Button, Divider, Switch, Modal, Form, Input, Row, Col, message } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { 
  CHANNEL_LIST,
  CHANNEL_DETAIL,
  CHANNEL_OPEN_CTRL,
  CHANNEL_OPERATE
} from '../api/graphType'
import {
  postChannelDelete,
  postChannelMutiUpdate,
  postChannelAllUpdate,
  postChannelAdd,
  postChannelModify
} from '../api/mock'

const { Column } = Table

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
  const deleteChannel = (item: any) => {
    console.log(item)
    Modal.confirm({
      title: '删除',
      content: `确定删除 ${item.name} 渠道?`,
      onOk() {
        return postChannelDelete({
          id: item.id
        }).then(() => {
          message.success('删除成功')
        }).catch(err => {
          console.log(err)
        })
      },
      onCancel() {},
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
      list: selectedRow
    }).then(() => {
      setMutiUpdateLoading(false)
      message.success('批量更新成功')
    }).catch(err => {
      setMutiUpdateLoading(false)
      console.log(err)
    })
  }

  // 全部更新
  const [allUpdateLoading, setAllUpdateLoading] = useState(false)
  const allUpdate = () => {
    setAllUpdateLoading(true)
    postChannelAllUpdate().then(() => {
      setAllUpdateLoading(false)
      message.success('全部更新成功')
    }).catch(err => {
      setAllUpdateLoading(false)
      console.log(err)
    })
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
    <div className="cm-flex-column" style={{
      height: '100%'
    }}>
      <div>
        <div className="clearfix">
          <Button onClick={allUpdate} loading={allUpdateLoading} className="fl mr-20" type="primary">全部更新</Button>
          <Button onClick={mutiUpdate} loading={mutiUpdateLoading} disabled={selectedRow.length === 0} className="fl" type="primary">批量更新</Button>
          <Button onClick={() => { updateForm(true) }} className="fr" type="primary">新增</Button>
        </div>
        <Divider />
      </div>
      {/* 列表 */}
      <div 
        className="cm-flex-1" style={{
          overflow: 'auto'
        }}>
        <Table 
          loading={channelListLoading}
          onChange={chgPage}
          rowSelection={rowSelection} 
          dataSource={list} 
          pagination={{
            current: pageCurrent,
            pageSize,
            total
          }}>
          <Column title="id" dataIndex="id" key="id" />
          <Column title="名称" dataIndex="name" key="name" />
          <Column title="排序" dataIndex="sort" key="sort" />
          <Column
            title="状态"
            dataIndex="isOpen"
            key="isOpen"
            render={(isOpen, item: any, index) => {
              return (
                <Switch onChange={() => {chgOpen(item, index)}} loading={item.loading} checkedChildren="开" unCheckedChildren="关" checked={isOpen === 1} />
              )
            }}
          />
          <Column
            title="操作"
            dataIndex="id"
            key="actions"
            render={(id, item: any) => (
              <div className="clearfix">
                <span onClick={() => {showDetail(item)}} className="fl cp topic mr-20">详情</span>
                <span onClick={() => {deleteChannel(item)}} className="fl cp topic">删除</span>
              </div>
            )}
          />
        </Table>
      </div>
      {/* 弹出框 */}
      <Modal
        title={isModify ? '修改' : '新增'}
        width="800px"
        visible={showDialog}
        destroyOnClose={true}
        onOk={validateForm}
        onCancel={() => {setShowDialog(false)}}>
        <Form layout='inline'>
          <Row>
            <Col span={12}>
              <Form.Item label="名称">
                {getFieldDecorator('name', {
                  initialValue: form.name,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '不能为空!',
                    },
                    {
                      max: 20,
                      message: '最多 20 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="域名">
                {getFieldDecorator('domain', {
                  initialValue: form.domain,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '不能为空!',
                    },
                    {
                      max: 100,
                      message: '最多 100 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="路径">
                {getFieldDecorator('hotUrl', {
                  initialValue: form.hotUrl,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '不能为空!',
                    },
                    {
                      max: 20,
                      message: '最多 20 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否开启">
                {getFieldDecorator('isOpen', { 
                  initialValue: form.isOpen,
                  valuePropName: 'checked' 
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="是否使用userAgent">
                {getFieldDecorator('isUseUserAgent', { 
                  initialValue: form.isUseUserAgent,
                  valuePropName: 'checked' 
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否SPA">
                {getFieldDecorator('isSpa', { 
                  initialValue: form.isSpa,
                  valuePropName: 'checked' 
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="cookie">
                {getFieldDecorator('cookie', {
                  initialValue: form.cookie,
                  rules: [
                    {
                      max: 1000,
                      message: '最多 1000 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="字符编码">
                {getFieldDecorator('charset', {
                  initialValue: form.charset,
                  rules: [
                    {
                      max: 20,
                      message: '最多 20 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="特殊抓取方法">
                {getFieldDecorator('listSpecialMethod', {
                  initialValue: form.listSpecialMethod,
                  rules: [
                    {
                      max: 20,
                      message: '最多 20 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="单个列表标签">
                {getFieldDecorator('listDom', {
                  initialValue: form.listDom,
                  rules: [
                    {
                      max: 100,
                      message: '最多 100 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="标题标签">
                {getFieldDecorator('listTitleDom', {
                  initialValue: form.listTitleDom,
                  rules: [
                    {
                      max: 100,
                      message: '最多 100 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="url标签">
                {getFieldDecorator('listUrlDom', {
                  initialValue: form.listUrlDom,
                  rules: [
                    {
                      max: 100,
                      message: '最多 100 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="url规则">
                {getFieldDecorator('listUrlRule', {
                  initialValue: form.listUrlRule,
                  rules: [
                    {
                      max: 100,
                      message: '最多 100 个字符!',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="排序">
                {getFieldDecorator('sort', {
                  initialValue: form.sort,
                  rules: [
                    {
                      type: 'string',
                      message: '只能输入数字!',
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default Form.create({ name: 'register' })(Channel)