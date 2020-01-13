import React, { useState, useEffect } from 'react'
import { Table, Button, Divider, message } from 'antd'
import { 
  postChannelMutiUpdate,
  postFailRefreshAll,
  getFailList
} from '../../api/actions'

const { Column } = Table

const pageSize: number = 10
let refreshOk: boolean = true

const Fail = () => {
  
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
    getFailList(data).then(res => {
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

  // 全部更新
  const [allUpdateLoading, setAllUpdateLoading] = useState(false)
  const allUpdate = () => {
    setAllUpdateLoading(true)
    postFailRefreshAll().then((res: any) => {
      setAllUpdateLoading(false)
      message.success(res.message)
      getList()
    }).catch(err => {
      setAllUpdateLoading(false)
      console.log(err)
      getList()
    })
  }

  // 更新单个
  const updateItem = (item: any, index: number) => {
    if (!refreshOk) {
      return
    }
    refreshOk = false

    setList((list: any) => {
      const nList = list.map((el: any, i: number) => {
        if (i === index) {
          el.refreshLoading = true
        }
        return el
      })
      return nList
    })

    postChannelMutiUpdate({
      list: [item.id],
      type: 'muti'
    }).then(() => {
      setList((list: any) => {
        const nList = list.map((el: any, i: number) => {
          if (i === index) {
            el.refreshLoading = false
          }
          return el
        })
        return nList
      })
      refreshOk = true
      message.success('更新成功')
      getList()
    }).catch(err => {
      setList((list: any) => {
        const nList = list.map((el: any, i: number) => {
          if (i === index) {
            el.refreshLoading = false
          }
          return el
        })
        return nList
      })
      refreshOk = true
      getList()
      console.log(err)
    })
  }

  return (
    <div>
      <div className="clearfix">
        <Button onClick={allUpdate} loading={allUpdateLoading} className="fl mr-20" type="primary">全部更新</Button>
      </div>
      <Divider />
      {/* 列表 */}
      <Table 
        onChange={chgPage}
        dataSource={list} 
        pagination={{
          current: pageCurrent,
          pageSize,
          total
        }}>
        <Column title="id" dataIndex="id" key="id" />
        <Column title="名称" dataIndex="name" key="name" />
        <Column title="失败次数" dataIndex="num" key="num" />
        <Column
          title="操作"
          dataIndex="id"
          key="actions"
          render={(id, item: any, index: number) => (
            <div className="clearfix">
              <Button onClick={() => {updateItem(item, index)}} loading={item.refreshLoading}  className="fl mr-20" type="primary">更新</Button>
            </div>
          )}
        />
      </Table>
    </div>
  )
}

export default Fail