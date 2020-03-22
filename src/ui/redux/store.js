import { configureStore } from '@reduxjs/toolkit'
import tabsReducer from './slices/tabs'

export default configureStore({
  reducer: {
    tabs: tabsReducer
  }
})
