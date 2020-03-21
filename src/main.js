import Electron, { BrowserWindow } from 'electron'
import Path from 'path'
import IPFS from 'ipfs'
import * as Protocol from './protocol'
import OS from 'os'

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: Path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('lib/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

Electron.app.allowRendererProcessReuse = true

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
Electron.app.whenReady().then(onReady)

// Quit when all windows are closed.
Electron.app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') Electron.app.quit()
})

Electron.app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

Electron.protocol.registerSchemesAsPrivileged([{
  scheme: 'ipfs',
  privileges: {
    standard: true,
    secure: true,
    allowServiceWorkers: true,
    supportFetchAPI: true,
    corsEnabled: true
  }
}])

async function onReady () {
  // TODO: add delegates
  const ipfs = await IPFS.create({
    repo: Path.join(OS.homedir(), '.planetary')
  })
  const protocol = await Protocol.create({ ipfs })

  Electron.protocol.registerStreamProtocol('ipfs', protocol.handler)

  createWindow()
}
