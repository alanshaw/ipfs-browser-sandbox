import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'peers',
  initialState: {
    list: []
  },
  reducers: {
    updatePeers: (state, action) => {
      state.list = action.payload
    }
  }
})

export const { updatePeers } = slice.actions

export const selectPeersList = state => state.peers.list

export default slice.reducer
