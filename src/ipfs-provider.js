import IPFS from 'ipfs'
import ipfsClient from 'ipfs-http-client'
import defer from 'p-defer'

const API_ADDRS = ['/ip4/127.0.0.1/tcp/5001', '/ip4/127.0.0.1/tcp/5002']
const HEALTH_CHECK_PERIOD = 1000
const DAEMON_CHECK_PERIOD = 60 * 1000

export default class IpfsProvider {
  constructor (options) {
    options = options || {}
    options.apiAddrs = (options.apiAddrs || []).concat(API_ADDRS)
    this._options = options || {}
    this._type = 'none'
    this._healthChecker = periodically(() => this._healthCheck(), options.healthCheckPeriod || HEALTH_CHECK_PERIOD)
    this._daemonChecker = periodically(() => this._daemonCheck(), options.daemonCheckPeriod || DAEMON_CHECK_PERIOD)
  }

  async provide () {
    if (this._ipfs) return this._ipfs
    if (this._ipfsPromise) {
      return this._ipfsPromise.promise
    }
    this._ipfsPromise = defer()

    let ipfs, id, addr
    let type = 'none'

    for (addr of this._options.apiAddrs) {
      try {
        ipfs = ipfsClient(addr)
        id = (await ipfs.id()).id
        type = 'external'
        break
      } catch (_) {}
    }

    if (type === 'none') {
      try {
        ipfs = await IPFS.create(this._options.ipfsOptions)
        id = (await ipfs.id()).id
        type = 'local'
      } catch (err) {
        this._ipfsPromise.reject(err)
        this._ipfsPromise = null
        throw err
      }
    }

    console.log(`using ${type} IPFS node ${id}${type === 'external' ? ' at ' + addr : ''}`)

    this._ipfs = ipfs
    this._type = type
    this._ipfsPromise.resolve(ipfs)
    this._ipfsPromise = null
    return ipfs
  }

  async _healthCheck () {
    if (!this._ipfs) return // nothing to check

    try {
      await this._ipfs.id()
    } catch (err) {
      console.warn('failed health check', err)
      this._ipfs = null
      this._type = 'none'
    }
  }

  async _daemonCheck () {
    if (this._type !== 'local') return // already using an external daemon (or no IPFS node requested yet)

    for (const addr of this._options.apiAddrs) {
      try {
        const ipfs = ipfsClient(addr)
        const { id } = await ipfs.id()
        console.log(`using external IPFS node ${id} at ${addr}`)
        const localIpfs = this._ipfs
        this._ipfs = ipfs
        this._type = 'external'
        try {
          await localIpfs.stop()
        } catch (err) {
          console.error('failed to stop local IPFS', err)
        }
        return
      } catch (_) {}
    }
  }

  async destroy () {
    this._healthChecker.stop()
    this._daemonChecker.stop()

    if (this._ipfsPromise) { // wait for running provide to complete
      try { await this._ipfsPromise.promise } catch (_) {}
    }

    if (this._type === 'local') {
      try {
        await this._ipfs.stop()
      } catch (err) {
        console.error('failed to stop local IPFS', err)
      }
    }
  }
}

function periodically (fn, period) {
  let timeoutId = setTimeout(async function onPeriod () {
    await fn()
    timeoutId = setTimeout(onPeriod, period)
  }, period)
  return { stop: () => clearTimeout(timeoutId) }
}
