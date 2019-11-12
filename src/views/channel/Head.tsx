import React  from 'react'
import { Button } from 'antd'

interface HeadProps {
  allUpdate: any
  allUpdateLoading: any
  mutiUpdate: any
  mutiUpdateLoading: any
  selectedRow: any
  openNewDialog: any
}

const Head: React.FC<HeadProps> = (props: any) => {
  const { 
    allUpdate,
    allUpdateLoading,
    mutiUpdate,
    mutiUpdateLoading,
    selectedRow,
    openNewDialog
  } = props
  return (
    <div className="clearfix">
      <Button onClick={allUpdate} loading={allUpdateLoading} className="fl mr-20" type="primary">全部更新</Button>
      <Button onClick={mutiUpdate} loading={mutiUpdateLoading} disabled={selectedRow.length === 0} className="fl" type="primary">批量更新</Button>
      <Button onClick={openNewDialog} className="fr" type="primary">新增</Button>
    </div>
  )
}

export default Head