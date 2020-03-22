import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './ui/App'
import store from './ui/redux/store'
import { openTab } from './ui/redux/slices/tabs'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

store.dispatch(openTab())
