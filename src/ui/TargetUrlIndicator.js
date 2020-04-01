import React from 'react'
import { useSelector } from 'react-redux'
import { selectSelectedTab } from './redux/slices/tabs'

export default function TargetUrlIndicator () {
  const tab = useSelector(selectSelectedTab)
  return tab && tab.targetUrl ? (
    <div className='absolute bottom-0 left-0 bg-light-gray b--gray bt br br2 br--right br--top pa1 f7 shadow-4'>
      {tab.targetUrl.replace('ipfs://', '/ipfs/')}
    </div>
  ) : null
}
