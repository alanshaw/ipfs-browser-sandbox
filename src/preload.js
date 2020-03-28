const { ipcRenderer } = require('electron')

// TODO: get https://github.com/alanshaw/it-postmsg and postmsg-fetch working
const ipfs = {
  swarm: {
    addrs: () => ipcRenderer.invoke('ipfs.swarm.addrs')
  }
}

global.ipfs = { enable: async () => ipfs }
