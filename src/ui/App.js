import React from 'react'
import { Tabs } from './Tabs'
import { Toolbar } from './Toolbar'
import { Page } from './Page'

function App () {
  return (
    <div className='flex flex-column vh-100'>
      <div className='flex-none'>
        <Tabs />
        <Toolbar />
      </div>
      <div className='flex-auto'>
        <Page />
      </div>
    </div>
  )
}

export default App
