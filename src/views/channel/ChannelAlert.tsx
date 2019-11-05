import React  from 'react'
import { Switch, Modal, Form, Input, Row, Col } from 'antd'

interface ChannelAlertProps {
  isModify: any
  showDialog: any
  validateForm: any
  setShowDialog: any
  getFieldDecorator: any
  form: any
}

const ChannelAlert: React.FC<ChannelAlertProps> = (props: any) => {
  const { isModify, showDialog, validateForm, setShowDialog, getFieldDecorator, form } = props
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
  )
}

export default ChannelAlert