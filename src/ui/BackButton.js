import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { goBack, selectSelectedTab } from './redux/slices/tabs'

export default function BackButton () {
  const tab = useSelector(selectSelectedTab)
  const dispatch = useDispatch()

  return (
    <button
      type='button'
      className={`button-reset pa2 bw0 br2 outline-0 bg-transparent ${tab.canGoBack ? 'hover-bg-black-10' : ''}`}
      onClick={e => dispatch(goBack({ tabId: tab.id }))}
      disabled={!tab.canGoBack}
    >
      ←
    </button>
  )
}
