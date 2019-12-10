import React from 'react'
import { Switch, Modal, Form, Input, Row, Col, message } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { 
  postChannelAdd,
  postChannelModify
} from '../../api/actions'

interface AlertProps extends FormComponentProps {
  ownForm: any
  isModify: any
  showDialog: any
  setShowDialog: any
  modifyId: any
  getList: any
}

let submitOk: boolean = true

const Alert: React.FC<AlertProps> = (props: any) => {
  const { 
    ownForm,
    isModify,
    showDialog,
    setShowDialog,
    form: {getFieldDecorator },
    modifyId,
    getList
  } = props

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
    let data = JSON.parse(JSON.stringify(values))
    if (isModify) {
      data.id = modifyId
    }
    return data
  }
  const submitFormAdd = (values: object) => {
    let data = dealForm(values)
    postChannelAdd(data).then(res => {
      message.success('新增成功')
      setShowDialog(false)
      getList()
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
      getList()
      submitOk = true
    }).catch(err => {
      submitOk = true
      console.log(err)
    })
  }
  return (
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
                initialValue: ownForm.name,
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
                initialValue: ownForm.domain,
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
                initialValue: ownForm.hotUrl,
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
                initialValue: ownForm.isOpen,
                valuePropName: 'checked' 
              })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="是否使用userAgent">
              {getFieldDecorator('isUseUserAgent', { 
                initialValue: ownForm.isUseUserAgent,
                valuePropName: 'checked' 
              })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="是否SPA">
              {getFieldDecorator('isSpa', { 
                initialValue: ownForm.isSpa,
                valuePropName: 'checked' 
              })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="cookie">
              {getFieldDecorator('cookie', {
                initialValue: ownForm.cookie,
                rules: [
                  {
                    max: 2000,
                    message: '最多 2000 个字符!',
                  }
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="字符编码">
              {getFieldDecorator('charset', {
                initialValue: ownForm.charset,
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
                initialValue: ownForm.listSpecialMethod,
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
                initialValue: ownForm.listDom,
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
                initialValue: ownForm.listTitleDom,
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
                initialValue: ownForm.listUrlDom,
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
                initialValue: ownForm.listUrlRule,
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
                initialValue: ownForm.sort,
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
  )
}

export default Form.create<AlertProps>({ name: 'alert' })(Alert)