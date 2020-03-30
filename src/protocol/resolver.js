import CID from 'cids'

export default async function resolve ({ ipfsProvider }, url) {
  const { host: cid, pathname: path } = url
  console.log(`resolve ${url}`)

  const res = {
    cid: new CID(cid),
    remainderPath: path.startsWith('/') ? path.slice(1) : path,
    node: null
  }

  const ipfs = await ipfsProvider.provide()
  const resolveSource = ipfs.dag.resolve(cid, path)

  // FIXME: ipfs-http-client and ipfs return different things 😱
  if (resolveSource.then) {
    const { cid, remPath } = await resolveSource
    res.cid = cid
    res.remainderPath = remPath
    res.node = (await ipfs.dag.get(cid)).value
  } else {
    for await (const { value, remainderPath } of resolveSource) {
      if (CID.isCID(value)) {
        console.log(`resolved /ipfs/${res.cid}/${res.remainderPath} to /ipfs/${value}/${remainderPath}`)
        res.cid = value
      } else {
        console.log(`resolved /ipfs/${res.cid}/${res.remainderPath} to /ipfs/${res.cid}/${remainderPath}`)
        res.node = value
      }
      res.remainderPath = remainderPath
    }
  }

  return res
}
