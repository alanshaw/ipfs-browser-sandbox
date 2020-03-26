import toStream from 'it-to-stream'
import CID from 'cids'
import { Buffer } from 'buffer'
import Unixfs from 'ipfs-unixfs'
import * as FileType from 'file-type'
import mime from 'mime-types'
import Reader from 'it-reader'
import toBuffer from 'it-buffer'

const INDEX_HTML_FILES = ['index.html', 'index.htm', 'index.shtml']
const MINIMUM_BYTES = 4100

async function create ({ ipfs }) {
  return {
    // TODO: add timeout
    async handler (request, respond) {
      const start = Date.now()
      console.log(`handling ${request.url}`)

      const url = new URL(request.url)
      const { cid, remainderPath, node } = await resolve({ ipfs }, url)

      // If there's more to resolve it means we're missing an IPLD format resolver
      if (remainderPath) {
        return respond(errorResponse(501, `missing IPLD format resolver ${cid.codec}`))
      }

      if (!Responders[cid.codec]) {
        return respond(errorResponse(501, `missing responder for ${cid.codec}`))
      }

      await Responders[cid.codec]({ ipfs }, url, cid, node, respond)
      console.log(`handled ${request.url} in ${Date.now() - start}ms`)
    }
  }
}

const Responders = {
  'dag-pb': async ({ ipfs }, url, cid, node, respond) => {
    let meta
    try {
      meta = Unixfs.unmarshal(node.Data)
    } catch (err) {
      console.error(err)
      return respond(errorResponse(500, `failed to unmarshal unixfs data: ${err.message}`))
    }

    const headers = { 'Content-Length': meta.fileSize() }

    if (url.searchParams.has('filename')) {
      headers['Content-Disposition'] = `inline; filename*=UTF-8''${encodeURIComponent(url.searchParams.get('filename'))}`
    }

    if (meta.type.includes('directory')) {
      for (const fileName of INDEX_HTML_FILES) {
        try {
          const stats = await ipfs.files.stat(`/ipfs/${cid}/${fileName}`)
          headers['Content-Type'] = 'text/html'
          return respond({ headers, data: toStream.readable(ipfs.cat(stats.cid)) })
        } catch (_) {}
      }

      // TODO render directory
      return respond(errorResponse(501, 'directory renderer not yet implemented'))
    }

    let response
    try {
      response = await detectContentType(url.pathname, ipfs.cat(cid))
    } catch (err) {
      console.error(err)
      return respond(errorResponse(500, `failed to detect content type: ${err.message}`))
    }

    if (response.contentType) {
      headers['Content-Type'] = response.contentType
    }

    console.log('headers', headers)

    return respond({ headers, data: toStream.readable(toBuffer(response.source)) })
  },
  'dag-cbor': ({ ipfs }, url, cid, node, respond) => {
    respond({
      headers: { 'Content-Type': 'application/json' },
      data: toStream.readable([Buffer.from(JSON.stringify(node, null, 2))])
    })
  }
}

function errorResponse (statusCode, message) {
  return { statusCode, data: toStream.readable([Buffer.from(message)]) }
}

async function resolve ({ ipfs }, url) {
  const { host: cid, pathname: path } = url
  console.log(`resolve ${url}`)

  const res = {
    cid: new CID(cid),
    remainderPath: path.startsWith('/') ? path.slice(1) : path,
    node: null
  }

  for await (const { value, remainderPath } of ipfs.dag.resolve(cid, path)) {
    if (CID.isCID(value)) {
      console.log(`resolved /ipfs/${res.cid}/${res.remainderPath} to /ipfs/${value}/${remainderPath}`)
      res.cid = value
    } else {
      console.log(`resolved /ipfs/${res.cid}/${res.remainderPath} to /ipfs/${res.cid}/${remainderPath}`)
      res.node = value
    }
    res.remainderPath = remainderPath
  }

  return res
}

async function detectContentType (path, source) {
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

  // if we were unable to, fallback to the `path` which might contain the extension
  return { source, contentType: mime.contentType(mime.lookup(path)) }
}

export { create }
