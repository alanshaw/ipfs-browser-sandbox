import React from 'react'
import { useSelector } from 'react-redux'
import { selectTabList, selectSelectedTabId } from './redux/slices/tabs'
import WebView from './WebView'

export function Page () {
  const tabs = useSelector(selectTabList)
  const selectedTabId = useSelector(selectSelectedTabId)

  return (
    <div className='h-100' style={{ background: 'white url(images/logo-watermark.png) no-repeat center', backgroundSize: '256px' }}>
      {tabs.map(t => (
        <div key={t.id} className={`h-100 ${t.id === selectedTabId ? '' : 'dn'}`}>
          <WebView tab={t} url={t.url} />
        </div>
      ))}
    </div>
  )
}
