import { gql } from 'apollo-boost';

const CHANNEL_LIST = gql`
  query channelList($pageSize: Int, $current: Int) {
    channelList(pageSize: $pageSize, current: $current) {
      list {
        id
        name
        sort
        isOpen
      }
      total
    }
  }
`

const CHANNEL_DETAIL = gql`
  query channelDetail($id: Int) {
    channelDetail(id: $id) {
      id
      name
      domain
      isOpen
      isSpa
      cookie
      isUseUserAgent
      charset
      hotUrl
      listSpecialMethod
      listDom
      listTitleDom
      listUrlDom
      listUrlRule
      sort
    }
  }
`

const CHANNEL_OPEN_CTRL = gql`
  mutation channelOpenCtrl($id: Int, $isOpen: Int) {
    channelOpenCtrl(id: $id, isOpen: $isOpen) {
      id
      isOpen
    }
  }
`

const CHANNEL_OPERATE = gql`
  mutation channelOperate($form: channelInput, $type: String!) {
    channelOperate(form: $form, type: $type) {
      id
    }
  }
`

const CHANNEL_DELETE = gql`
  mutation channelDelete($id: Int!) {
    channelDelete(id: $id) {
      id
    }
  }
`

const CHANNEL_MUTI_REFRESH = gql`
  mutation channelMutiRefresh($type: String!, $channelList: [Int]) {
    channelMutiRefresh(type: $type, channelList: $channelList) {
      code
      message
    }
  }
`

export {
  CHANNEL_LIST,
  CHANNEL_DETAIL,
  CHANNEL_OPEN_CTRL,
  CHANNEL_OPERATE,
  CHANNEL_DELETE,
  CHANNEL_MUTI_REFRESH
}