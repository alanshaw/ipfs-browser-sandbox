import React from 'react'
import { useSelector } from 'react-redux'
import {
  selectSelectedTab
} from './redux/slices/tabs'

export function Page () {
  const tab = useSelector(selectSelectedTab)
  if (!tab) return null

  return (
    <div className='bg-white h-100'>
      {tab.url ? (
        <webview
          className='h-100 flex'
          enableremotemodule='false'
          webpreferences='allowDisplayingInsecureContent,defaultEncoding=utf-8,scrollBounce,nativeWindowOpen=yes'
          autosize='on'
          src={tab.url}
        />
      ) : null}
    </div>
  )
}

// Register scheme:
// https://github.com/beakerbrowser/beaker/blob/3809181032140f03a42d876dd63119b0b5d73e8a/app/background-process.js#L61

// Handler:
// https://github.com/beakerbrowser/beaker-core/blob/master/dat/protocol.js#L42

// function createWebviewEl (id, url) {
//   var el = document.createElement('webview')
//   el.dataset.id = id
//   // el.setAttribute('preload', 'file://' + path.join(APP_PATH, 'webview-preload.build.js'))
//   el.setAttribute('enableremotemodule', 'false')
//   el.setAttribute('webpreferences', 'allowDisplayingInsecureContent,defaultEncoding=utf-8,scrollBounce,nativeWindowOpen=yes')
//   el.setAttribute('src', url)
//   return el
// }
