const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    mouseEvent: (position) => ipcRenderer.send('mouse-event', position),
    keyEvent: (data) => ipcRenderer.send('key-event', data)
})
