import { configureStore } from '@reduxjs/toolkit'
import peersReducer from './slices/peers'
import tabsReducer from './slices/tabs'

export default configureStore({
  reducer: {
    peers: peersReducer,
    tabs: tabsReducer
  }
})
