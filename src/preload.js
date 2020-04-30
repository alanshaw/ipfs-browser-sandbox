const { ipcRenderer } = require('electron')

// TODO: get https://github.com/alanshaw/it-postmsg and postmsg-fetch working
const ipfs = {
  swarm: {
    peers: () => ipcRenderer.invoke('ipfs.swarm.peers')
  }
}

global.ipfs = { enable: async () => ipfs }
