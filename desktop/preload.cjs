/* The only bridge between the game page and the desktop app: updates and DLC, nothing else. */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("stillwater", {
  desktop: true,
  platform: process.platform,
  update: {
    get: () => ipcRenderer.invoke("update:get"),
    check: () => ipcRenderer.invoke("update:check"),
    download: () => ipcRenderer.invoke("update:download"),
    install: () => ipcRenderer.invoke("update:install"),
    onState: (cb) => ipcRenderer.on("update:state", (_, state) => cb(state)),
  },
  dlc: {
    catalog: () => ipcRenderer.invoke("dlc:catalog"),
    installed: () => ipcRenderer.invoke("dlc:installed"),
    install: (id) => ipcRenderer.invoke("dlc:install", id),
    remove: (id) => ipcRenderer.invoke("dlc:remove", id),
    onProgress: (cb) => ipcRenderer.on("dlc:progress", (_, p) => cb(p)),
  },
});
