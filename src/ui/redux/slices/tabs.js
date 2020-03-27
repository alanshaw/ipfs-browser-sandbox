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
      state.list = state.list.concat({
        id: state.selectedTabId,
        title: 'New Tab',
        url: null,
        search: null,
        canGoBack: false,
        canGoForward: false,
        wentBackAt: null,
        wentForwardAt: null,
        reloadedAt: null
      })
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
    goBack: (state, action) => {
      const { tabId } = action.payload
      state.list = state.list.map(t => t.id === tabId ? { ...t, wentBackAt: Date.now() } : t)
    },
    setCanGoBack: (state, action) => {
      const { tabId, value } = action.payload
      state.list = state.list.map(t => t.id === tabId ? { ...t, canGoBack: value } : t)
    },
    goForward: (state, action) => {
      state.list = state.list.map(t => t.id === action.payload.tabId ? { ...t, wentForwardAt: Date.now() } : t)
    },
    setCanGoForward: (state, action) => {
      const { tabId, value } = action.payload
      state.list = state.list.map(t => t.id === tabId ? { ...t, canGoForward: value } : t)
    },
    reload: (state, action) => {
      const { tabId } = action.payload
      state.list = state.list.map(t => t.id === tabId ? { ...t, reloadedAt: Date.now() } : t)
    },
    setTabTitle: (state, action) => {
      const index = state.list.findIndex(t => t.id === action.payload.tabId)
      if (index === -1) return
      state.list[index] = { ...state.list[index], title: action.payload.value }
    },
    setTabSearch: (state, action) => {
      const index = state.list.findIndex(t => t.id === action.payload.tabId)
      if (index === -1) return
      state.list[index] = { ...state.list[index], search: action.payload.value }
    },
    setTabUrl: (state, action) => {
      const index = state.list.findIndex(t => t.id === action.payload.tabId)
      if (index === -1) return
      state.list[index] = { ...state.list[index], url: action.payload.value }
    },
    changeSelectedTab: (state, action) => {
      if (!state.list.some(t => t.id === action.payload.id)) return
      state.selectedTabId = action.payload.id
    }
  }
})

export const {
  openTab,
  closeTab,
  goBack,
  setCanGoBack,
  goForward,
  setCanGoForward,
  reload,
  setTabTitle,
  setTabSearch,
  setTabUrl,
  changeSelectedTab
} = slice.actions

export const selectTabList = state => state.tabs.list
export const selectSelectedTab = state => state.tabs.list.find(t => t.id === state.tabs.selectedTabId)
export const selectSelectedTabId = state => state.tabs.selectedTabId

export default slice.reducer
