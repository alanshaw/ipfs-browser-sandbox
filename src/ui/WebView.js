import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setTabTitle, setTabSearch } from './redux/slices/tabs'

export class WebView extends Component {
  shouldComponentUpdate (nextProps) {
    if (!this.props.url && nextProps.url) return true

    if (this.ref) {
      if (this.props.url !== nextProps.url) {
        this.ref.loadURL(nextProps.url)
      }
    }

    return false
  }

  onRef (ref) {
    this.ref = ref

    if (ref) {
      ref.addEventListener('page-title-updated', e => {
        this.props.dispatch(setTabTitle({ tabId: this.props.tabId, value: e.title }))
      })
      ref.addEventListener('will-navigate', e => {
        this.props.dispatch(setTabSearch({ tabId: this.props.tabId, value: e.url }))
      })
    }
  }

  render () {
    if (!this.props.url) return null
    return (
      <webview
        ref={r => this.onRef(r)}
        className='bg-white h-100 flex'
        enableremotemodule='false'
        webpreferences='allowDisplayingInsecureContent,defaultEncoding=utf-8,scrollBounce,nativeWindowOpen=yes'
        autosize='on'
        src={this.props.url}
      />
    )
  }
}

export default connect()(WebView)
