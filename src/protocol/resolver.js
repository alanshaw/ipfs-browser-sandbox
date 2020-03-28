import CID from 'cids'

export default async function resolve ({ ipfs }, url) {
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
