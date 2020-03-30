import toStream from 'it-to-stream'
import resolve from './resolver'
import { raw, dagCbor, dagPb } from './responders'

const Responders = { raw, 'dag-cbor': dagCbor, 'dag-pb': dagPb }
const errorResponse = (statusCode, message) => ({ statusCode, data: toStream.readable([Buffer.from(message)]) })

async function create ({ ipfsProvider }) {
  return {
    // TODO: add timeout
    async handler (request, respond) {
      const start = Date.now()
      console.log(`handling ${request.url}`)

      const url = new URL(request.url)
      let cid, remainderPath, node

      try {
        ({ cid, remainderPath, node } = await resolve({ ipfsProvider }, url))
      } catch (err) {
        console.error(err)
        return respond(errorResponse(500, err.message))
      }

      if (!Responders[cid.codec]) {
        return respond(errorResponse(501, `missing responder for ${cid.codec}`))
      }

      let response
      try {
        response = await Responders[cid.codec]({ ipfsProvider }, url, cid, remainderPath, node)
      } catch (err) {
        console.error(`failed to handle ${request.url} in ${Date.now() - start}ms`, err)
        return respond(errorResponse(err.statusCode || 500, err.message))
      }

      respond(response)
      console.log(`handled ${request.url} in ${Date.now() - start}ms`)
    }
  }
}

export { create }
