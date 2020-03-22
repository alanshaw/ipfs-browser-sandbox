import { createSlice } from '@reduxjs/toolkit'

let tabId = 0

export const slice = createSlice({
  name: 'tabs',
  initialState: {
    list: [],
    selectedTabId: null
  },
  reducers: {
    openTab: state => {
      state.selectedTabId = tabId++
      state.list = state.list.concat({ id: state.selectedTabId, title: 'New Tab', url: null })
    },
    closeTab: (state, action) => {
      const closingTab = state.list.find(t => t.id === action.payload.id)
      if (!closingTab) return

      const selectedTabIndex = state.list.findIndex(t => t.id === state.selectedTabId)
      state.list = state.list.filter(t => t.id !== closingTab.id)

      // Pick a new selected tab if we closed the selected tab
      if (state.selectedTabId === closingTab.id) {
        const newSelectedTabIndex = Math.min(selectedTabIndex, state.list.length - 1)
        state.selectedTabId = state.list.length ? state.list[newSelectedTabIndex].id : null
      }
    },
    setTabTitle: (state, action) => {
      const index = state.list.findIndex(t => t.id === action.payload.id)
      if (index === -1) return
      state.list[index] = { ...state.list[index], title: action.payload.title }
    },
    setTabURL: (state, action) => {
      const index = state.list.findIndex(t => t.id === action.payload.id)
      if (index === -1) return
      state.list[index] = { ...state.list[index], url: action.payload.url }
    },
    changeSelectedTab: (state, action) => {
      if (!state.list.some(t => t.id === action.payload.id)) return
      state.selectedTabId = action.payload.id
    }
  }
})

export const { openTab, closeTab, setTabTitle, setTabURL, changeSelectedTab } = slice.actions

export const selectTabList = state => state.tabs.list
export const selectSelectedTabId = state => state.tabs.selectedTabId

export default slice.reducer
