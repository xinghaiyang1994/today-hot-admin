import React, { useState, useEffect }  from 'react'
import { Table, Button, Divider, Switch, Modal, Form, Input, Row, Col, message } from 'antd'
import {
  getChannelList,
  postChannelOpenCtrl,
  postChannelDelete,
  postChannelMutiUpdate,
  postChannelAllUpdate,
  getChannelDetail,
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
      current: pageCurrent,
      pageSize
    }
    console.log('查询', data)
    getChannelList(data).then(res => {
      let resData = res.data
      resData.list.forEach((el: any) => {
        el.loading = false
      })
      setList(resData.list)
      setTotal(resData.total)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    // setFieldsValue(form)
    getList()
  }, [pageCurrent])

  // 开关
  const chgOpen = (index: number, status: boolean) => {
    if (!openOk) {
      return
    }
    openOk = false

    let listNew = JSON.parse(JSON.stringify(list))
    listNew[index].loading = true
    setList(listNew)

    postChannelOpenCtrl({
      status
    }).then(() => {
      let listNew = JSON.parse(JSON.stringify(list))
      listNew[index].isOpen = status ? 1 : 0
      listNew[index].loading = false
      setList(listNew)
      openOk = true
      message.success('修改成功')
    }).catch(err => {
      let listNew = JSON.parse(JSON.stringify(list))
      listNew[index].loading = false
      setList(listNew)
      openOk = true
      console.log(err)
    })
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
    data.isSpa = !!resData.isSpa
    return data
  }
  
  // 表单
  const [isModify, setIsModify] = useState(false)
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formItem)))
  const { getFieldDecorator } = props.form
  const validateForm = () => {
    if (!submitOk) {
      return
    }
    submitOk = false
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log(values)
        isModify ? submitFormModify(values) : submitFormAdd(values)
      }
    })
  }
  const dealForm = (values: object) => {
    return values
  }
  const submitFormAdd = (values: object) => {
    let data = dealForm(values)
    postChannelAdd(data).then(res => {
      message.success('新增成功')
      setShowDialog(false)
      submitOk = true
    }).catch(err => {
      submitOk = true
      console.log(err)
    })
  }
  const submitFormModify = (values: object) => {
    let data = dealForm(values)
    postChannelModify(data).then(res => {
      message.success('修改成功')
      setShowDialog(false)
      submitOk = true
    }).catch(err => {
      submitOk = true
      console.log(err)
    })
  }

  return (
    <div>
      <div className="clearfix">
        <Button onClick={allUpdate} loading={allUpdateLoading} className="fl mr-20" type="primary">全部更新</Button>
        <Button onClick={mutiUpdate} loading={mutiUpdateLoading} disabled={selectedRow.length === 0} className="fl" type="primary">批量更新</Button>
        <Button onClick={openNewDialog} className="fr" type="primary">新增</Button>
      </div>
      <Divider />
      {/* 列表 */}
      <Table 
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
              <Switch onChange={(status) => {chgOpen(index, status)}} loading={item.loading} checkedChildren="开" unCheckedChildren="关" checked={isOpen === 1} />
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