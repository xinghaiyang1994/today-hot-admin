import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import {
  GET_USER_INFO
} from './action-type'

let infoDefault = {
  id: '',
  name: ''
}
function reducerInfo(state = infoDefault, action: any) {
  switch (action.type) {
    case GET_USER_INFO:
      return Object.assign({}, action.state)
    default:
      return state
  }
}

export default createStore(
  combineReducers({
    reducerInfo
  }),
  applyMiddleware(thunk)
)