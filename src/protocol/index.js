import resolve from './resolver'
import { raw, dagCbor, dagPb } from './responders'
import errorResponse from './error-response'

const Responders = { raw, 'dag-cbor': dagCbor, 'dag-pb': dagPb }

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

export { create }
