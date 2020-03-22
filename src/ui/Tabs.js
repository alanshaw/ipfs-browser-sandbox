import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  openTab,
  closeTab,
  changeSelectedTab,
  selectTabList,
  selectSelectedTabId
} from './redux/slices/tabs'

export function Tabs () {
  const tabs = useSelector(selectTabList)
  const selectedTabID = useSelector(selectSelectedTabId)
  const dispatch = useDispatch()

  return (
    <div>
      <ul>
        {tabs.map(t => {
          return (
            <li key={t.id} onClick={() => dispatch(changeSelectedTab({ id: t.id }))}>
              <span>{t.title} {t.id === selectedTabID ? ' (selected)' : ''}</span>
              <button onClick={() => dispatch(closeTab({ id: t.id }))}>x</button>
            </li>
          )
        })}
      </ul>
      <button onClick={() => dispatch(openTab())}>+</button>
    </div>
  )
}
