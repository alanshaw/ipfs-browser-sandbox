import toStream from 'it-to-stream'

export default function errorResponse (statusCode, message) {
  return { statusCode, data: toStream.readable([Buffer.from(message)]) }
}
