const toStream = require('it-to-stream')

exports.create = async ipfs => {
  return {
    handler (request, respond) {
      const path = request.url.replace(/^ipfs:\/\//, '/ipfs/')
      // TODO: respond with statusCode and headers
      // https://www.electronjs.org/docs/api/protocol#protocolregisterstreamprotocolscheme-handler-completion
      // TODO: add timeout
      respond(toStream.readable(ipfs.cat(path)))
    }
  }
}
