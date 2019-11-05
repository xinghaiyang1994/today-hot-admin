import React  from 'react'
import { Table, Switch } from 'antd'
import styled from 'styled-components'
const { Column } = Table

const ChannelList = styled.div`
  overflow: auto;
`

interface ChannelListProps {
  channelListLoading: any     
  chgPage: any     
  list: any     
  rowSelection: any     
  pageCurrent: any     
  pageSize: any     
  total: any     
  chgOpen: any     
  showDetail: any     
  deleteChannel: any     
}

const ChannelListComponent: React.FC<ChannelListProps> = (props: any) => {
  const { channelListLoading, chgPage, rowSelection, list, pageCurrent, pageSize, total, chgOpen, showDetail, deleteChannel } = props
  return (
    <ChannelList>
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
    </ChannelList>
  )
}

export default ChannelListComponent