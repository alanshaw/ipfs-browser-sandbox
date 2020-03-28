import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { goForward, selectSelectedTab } from './redux/slices/tabs'

export default function ForwardButton () {
  const tab = useSelector(selectSelectedTab)
  const dispatch = useDispatch()

  return (
    <button
      type='button'
      className={`button-reset pa2 bw0 br2 outline-0 bg-transparent ${tab.canGoForward ? 'hover-bg-black-10' : ''}`}
      onClick={e => dispatch(goForward({ tabId: tab.id }))}
      disabled={!tab.canGoForward}
    >
      →
    </button>
  )
}
