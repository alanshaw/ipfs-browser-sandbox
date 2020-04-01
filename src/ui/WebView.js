import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setTabTitle, setTabSearch, setCanGoBack, setCanGoForward, setTabTargetUrl } from './redux/slices/tabs'

export class WebView extends Component {
  shouldComponentUpdate (nextProps) {
    if (!this.props.tab.url && nextProps.tab.url) return true

    if (this.ref) {
      if (this.props.tab.url !== nextProps.tab.url) {
        this.ref.loadURL(nextProps.tab.url)
      }
      if (nextProps.tab.wentBackAt && this.props.tab.wentBackAt < nextProps.tab.wentBackAt) {
        this.ref.goBack()
      }
      if (nextProps.tab.wentForwardAt && this.props.tab.wentForwardAt < nextProps.tab.wentForwardAt) {
        this.ref.goForward()
      }
    }

    return false
  }

  onRef (ref) {
    this.ref = ref

    if (ref) {
      ref.addEventListener('page-title-updated', e => {
        this.props.dispatch(setTabTitle({ tabId: this.props.tab.id, value: e.title }))
      })
      ref.addEventListener('will-navigate', e => {
        const url = e.url.replace('ipfs://', '/ipfs/')
        this.props.dispatch(setTabSearch({ tabId: this.props.tab.id, value: url }))
      })
      ref.addEventListener('load-commit', e => {
        if (!e.isMainFrame) return
        const url = e.url.replace('ipfs://', '/ipfs/')
        this.props.dispatch(setTabSearch({ tabId: this.props.tab.id, value: url }))
      })
      ref.addEventListener('did-stop-loading', e => {
        this.props.dispatch(setCanGoBack({ tabId: this.props.tab.id, value: ref.canGoBack() }))
        this.props.dispatch(setCanGoForward({ tabId: this.props.tab.id, value: ref.canGoForward() }))
      })
      ref.addEventListener('update-target-url', e => {
        this.props.dispatch(setTabTargetUrl({ tabId: this.props.tab.id, value: e.url }))
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
