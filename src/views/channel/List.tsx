import React  from 'react'
import { Table, Switch, Modal, message} from 'antd'
import { postChannelDelete } from '../../api/actions'

interface ListProps {
  chgPage: any
  rowSelection: any
  list: any
  pageCurrent: any
  pageSize: any
  total: any
  chgOpen: any
  showDetail: any
  getList: any
}

const { Column } = Table

const List: React.FC<ListProps> = (props: any) => {
  const { 
    chgPage,
    rowSelection,
    list,
    pageCurrent,
    pageSize,
    total,
    chgOpen,
    showDetail,
    getList
  } = props

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
          getList()
          message.success('删除成功')
        }).catch(err => {
          console.log(err)
        })
      },
      onCancel() {}
    })
  }

  return (
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
            <Switch onChange={(status) => {chgOpen(status, item, index)}} loading={item.loading} checkedChildren="开" unCheckedChildren="关" checked={isOpen === 1} />
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
  )
}

export default List