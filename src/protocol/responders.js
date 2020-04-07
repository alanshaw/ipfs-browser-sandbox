import toStream from 'it-to-stream'
import { Buffer } from 'buffer'
import Unixfs from 'ipfs-unixfs'
import * as FileType from 'file-type'
import mime from 'mime-types'
import Reader from 'it-reader'
import toBuffer from 'it-buffer'
import CID from 'cids'
import Directory from './directory'

const INDEX_HTML_FILES = ['index.html', 'index.htm', 'index.shtml']
const MINIMUM_BYTES = 4100

export async function raw ({ ipfsProvider }, url, cid, remainderPath, buffer) {
  const headers = { 'Content-Length': buffer.length }

  if (url.searchParams.has('filename')) {
    headers['Content-Disposition'] = `inline; filename*=UTF-8''${encodeURIComponent(url.searchParams.get('filename'))}`
  }

  let response
  try {
    response = await detectContentType(url, [buffer])
  } catch (err) {
    throw Object.assign(err, { message: `failed to detect content type: ${err.message}` })
  }

  if (response.contentType) {
    headers['Content-Type'] = response.contentType
  }

  console.log('headers', headers)
  return { headers, data: toStream.readable(toBuffer(response.source)) }
}

export async function dagPb ({ ipfsProvider }, url, cid, remainderPath, node) {
  let meta
  try {
    meta = Unixfs.unmarshal(node.Data)
  } catch (err) {
    throw Object.assign(err, { message: `failed to unmarshal unixfs data: ${err.message}` })
  }

  const headers = { 'Content-Length': meta.fileSize() }

  if (url.searchParams.has('filename')) {
    headers['Content-Disposition'] = `inline; filename*=UTF-8''${encodeURIComponent(url.searchParams.get('filename'))}`
  }

  const ipfs = await ipfsProvider.provide()

  if (meta.type.includes('directory')) {
    if (!url.pathname.endsWith('/')) {
      url.pathname += '/'
      // FIXME: redirects do not work
      // return { statusCode: 301, headers: { Location: url.toString() } }
      return { data: toStream.readable([Buffer.from(`<script>window.location='${url}'</script>`)]) }
    }

    headers['Content-Type'] = 'text/html'

    for (const fileName of INDEX_HTML_FILES) {
      try {
        const stats = await ipfs.files.stat(`/ipfs/${cid}/${fileName}`)
        return { headers, data: toStream.readable(ipfs.cat(stats.cid)) }
      } catch (_) {}
    }

    const path = `/ipfs/${url.hostname}${url.pathname}`
    return { headers, data: toStream.readable(Directory.render(path, ipfs.ls(cid))) }
  }

  let response
  try {
    response = await detectContentType(url, ipfs.cat(cid))
  } catch (err) {
    throw Object.assign(err, { message: `failed to detect content type: ${err.message}` })
  }

  if (response.contentType) {
    headers['Content-Type'] = response.contentType
  }

  console.log('headers', headers)
  return { headers, data: toStream.readable(toBuffer(response.source)) }
}

export const dagCbor = ({ ipfsProvider }, url, cid, remainderPath, node) => ({
  headers: { 'Content-Type': 'application/json' },
  data: toStream.readable([Buffer.from(JSON.stringify(node, (key, value) => {
    if (Object.prototype.toString.call(value) === '[object Object]') {
      for (const [k, v] of Object.entries(value)) {
        if (CID.isCID(v)) value[k] = { '/': v.toString() }
      }
    }
    return value
  }, 2))])
})

async function detectContentType (url, source) {
  // try to guess the filetype based on the first bytes
  try {
    const reader = Reader(source)
    const { value, done } = await reader.next(MINIMUM_BYTES)

    if (done) return { source: reader }

    const fileType = await FileType.fromBuffer(value.slice())

    if (fileType) {
      return {
        source: (async function * () {
          yield value
          yield * reader
        })(),
        contentType: fileType.mime
      }
    }
  } catch (err) {
    if (err.code !== 'ERR_UNDER_READ') throw err
    // not enough bytes for sniffing, just yield the data
    source = [err.buffer] // these are the bytes that were read (if any)
  }

  const filePath = ['', '/'].includes(url.pathname)
    ? url.searchParams.get('filename')
    : url.pathname

  // if we were unable to, fallback to the `path` which might contain the extension
  return { source, contentType: mime.contentType(mime.lookup(filePath)) }
}
