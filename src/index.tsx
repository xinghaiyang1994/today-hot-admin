import React, { lazy, Suspense} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider, Skeleton } from 'antd'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import * as serviceWorker from './serviceWorker'
import './style/common.scss' 
import './style/style.scss' 

const App = lazy(() => import('./App'))
const client = new ApolloClient({
  uri: 'http://localhost:3100/graphql'
})

ReactDOM.render( 
  <Router>
    <ApolloProvider client={client}>
      <ConfigProvider locale={zhCN}>
        <Suspense fallback={ <Skeleton active /> }>
          <App />
        </Suspense>
      </ConfigProvider>
    </ApolloProvider>
  </Router>, 
  document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
