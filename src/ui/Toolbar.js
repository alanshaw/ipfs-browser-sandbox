import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setTabSearch,
  setTabUrl,
  selectSelectedTab
} from './redux/slices/tabs'

export function Toolbar () {
  const tab = useSelector(selectSelectedTab)
  const dispatch = useDispatch()

  if (!tab) return null

  const onSubmit = e => {
    e.preventDefault()
    let url
    try {
      url = new URL(tab.search).toString()
    } catch (err) {
      // TODO: custom search engine
      url = `https://duckduckgo.com/?q=${encodeURIComponent(tab.search)}`
    }
    dispatch(setTabUrl({ tabId: tab.id, value: url }))
  }

  return (
    <form onSubmit={onSubmit} className='pa2 flex bb b--gray'>
      <input
        className='input-reset bg-white-90 ba b--gray pa2 br2 db f6 w-100 outline-0'
        style={{ boxShadow: '2px 2px 4px 0 rgba(0,0,0,.06)' }}
        value={tab.search || ''}
        onChange={e => dispatch(setTabSearch({ tabId: tab.id, value: e.target.value }))}
        placeholder='Search or enter address'
      />
    </form>
  )
}
