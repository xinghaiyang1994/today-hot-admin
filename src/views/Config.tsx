import React, { useState, useEffect } from 'react'
import { Table, Button, Divider, Input, message } from 'antd'
import { 
  getConfigAll,
  postConfigAllModify
} from '../api/actions'

const Config = () => {
  const [list, setList] = useState([])
  // 改变单个值
  const chgInput = (e: any, index: number) => {
    const value = e.target.value

    setList((list: any) => {
      const nList = list.map((el: any, i: number) => {
        if (i === index) {
          el.value = value
        }
        return el
      })
      return nList
    })
  }
  const columns: any = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '键',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render(text:any, record: any, index: number) {
        return (
          <div>
            <Input onChange={(e) => { chgInput(e, index) }} value={text} />
          </div>
        )
      }
    },
    
  ]

  // 获取所有配置列表
  const getList = () => {
    getConfigAll().then((res: any) => {
      console.log(res)
      let resData = res.data
      setList(resData)
    }).catch(err => {
      console.log(err)
    })
  }
  useEffect(() => {
    getList()
  }, [])

  // 修改所有配置
  const modifyAll = () => {
    console.log(list)
    postConfigAllModify({
      list
    }).then(() => {
      message.success('保存成功')
      getList()
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <div className="clearfix">
        <Button onClick={modifyAll} className="fr" type="primary">保存</Button>
      </div>
      <Divider />
      <Table dataSource={list} columns={columns} pagination={false} />
    </div>
  )
}

export default Config