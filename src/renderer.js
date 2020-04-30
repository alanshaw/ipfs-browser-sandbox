import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './ui/App'
import store from './ui/redux/store'
import { openTab } from './ui/redux/slices/tabs'
import { updatePeers } from './ui/redux/slices/peers'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

store.dispatch(openTab())

// See preload.js!
window.ipfs.enable().then(ipfs => {
  setTimeout(async function update () {
    const peers = await ipfs.swarm.peers()
    store.dispatch(updatePeers(peers))
    setTimeout(update, 5000)
  }, 5000)
})
