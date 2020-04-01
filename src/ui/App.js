import React from 'react'
import { Tabs } from './Tabs'
import Toolbar from './Toolbar'
import { Page } from './Page'
import TargetUrlIndicator from './TargetUrlIndicator'

function App () {
  return (
    <div className='flex flex-column vh-100'>
      <div className='flex-none'>
        <Tabs />
        <Toolbar />
      </div>
      <div className='flex-auto'>
        <Page />
        <TargetUrlIndicator />
      </div>
    </div>
  )
}

export default App
