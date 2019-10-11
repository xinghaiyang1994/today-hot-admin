import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import App from './App';
import * as serviceWorker from './serviceWorker';
import './style/common.scss' 
import './style/style.scss' 

ReactDOM.render( 
  <Router>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Router>, 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
