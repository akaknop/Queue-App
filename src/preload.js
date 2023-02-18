// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer, win } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    login: (data) => ipcRenderer.send("user:login", data),
});

ipcRenderer.on("login-failed", (event, args) => {
    args = JSON.parse(args);
    var element = document.getElementById("error-message");
    if (!args['status']) {
        element.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Wrong email or password. Please try again!'
        element.style.color = 'red';
        element.style.fontSize = '13px';
        return;
    }
    window.location.href = './dashboard.html'
});