import React, { lazy, Suspense} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider, Skeleton } from 'antd'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './store'
import './style/common.scss' 
import './style/style.scss' 

const App = lazy(() => import('./App'))

ReactDOM.render( 
  <Router>
    <ConfigProvider locale={zhCN}>
      <Suspense fallback={ <Skeleton active /> }>
        <Provider store={store}>
          <App />
        </Provider>
      </Suspense>
    </ConfigProvider>
  </Router>, 
  document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
