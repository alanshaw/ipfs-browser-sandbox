import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  openTab,
  closeTab,
  changeSelectedTab,
  selectTabList,
  selectSelectedTabId
} from './redux/slices/tabs'

const TabWidths = [200, 200, 175, 125, 100, 50, 50]
const MIN_TAB_WIDTH = 10

export function Tabs () {
  const tabs = useSelector(selectTabList)
  const selectedTabId = useSelector(selectSelectedTabId)
  const dispatch = useDispatch()
  const width = TabWidths[tabs.length - 1] || MIN_TAB_WIDTH

  return (
    <div className='bg-charcoal' style={{ paddingLeft: 78, '-webkit-app-region': 'drag' }}>
      <div className='flex'>
        <div className='flex flex-auto'>
          <ul className='flex list mv0 pl0'>
            {tabs.map((t, i) => (
              <li
                key={t.id}
                onClick={() => dispatch(changeSelectedTab({ id: t.id }))}
                className={`bt bw1 ${t.id === selectedTabId ? 'bg-snow b--aqua' : 'hover-bg-white-10 b--white-10'}`}
                style={{ '-webkit-app-region': 'no-drag' }}
              >
                <div className={`pv2 ph3 br nowrap ${t.id === selectedTabId ? 'b--snow' : 'b--white-10'} ${i === 0 ? 'bl' : ''}`}>
                  <span
                    className={`dib v-mid f7 mr2 ${t.id === selectedTabId ? '' : 'snow'} truncate`}
                    style={{ width, transition: 'width .3s ease-out' }}
                  >
                    {t.title}
                  </span>
                  {tabs.length > 1 ? (
                    <button
                      className={`input-reset pa0 lh-title f6 bw0 br1 bg-transparent ${t.id === selectedTabId ? 'hover-bg-black-10' : 'hover-bg-white-10 snow'}`}
                      onClick={() => dispatch(closeTab({ id: t.id }))}
                    >
                      ｘ
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <div className='ph2 pv1 flex flex-column justify-center'>
            <button
              className='input-reset ph1 pv0 bg-white-10 bw0 white-50 hover-bg-white-20 br1 f4 outline-0'
              style={{ '-webkit-app-region': 'no-drag' }}
              onClick={() => dispatch(openTab())}
            >
              +
            </button>
          </div>
        </div>
        <div className='flex-none'>
          <div
            title='This project is experimental! It is not secure and may be partly or entirely broken. Use at your own risk. It is here for demos, experimentation and fun times.'
            className='shadow-1 br2 bg-red hover-bg-light-red f7 white b ma2 pa1'
          >
            ⚠️ EXPERIMENTAL
          </div>
        </div>
      </div>
    </div>
  )
}
