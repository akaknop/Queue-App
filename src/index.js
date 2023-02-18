const { app, BrowserWindow } = require('electron');
const path = require('path');
const request = require('request');

const { ipcMain } = require('electron')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}



const createWindow = () => {
  var splash = new BrowserWindow({
    width: 300,
    height: 450,
    autoHideMenuBar: true,
    transparent: true,
    icon: path.join(__dirname, 'icon.png')
  });
  splash.setMenuBarVisibility(false)
  splash.loadFile(path.join(__dirname, 'splash.html'));

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // devTools: false,
    },
    icon: path.join(__dirname, 'icon.png')
  });

  setTimeout(function () { // Loading Screen
    splash.close();
    mainWindow.show();
  }, 5000);

  // mainWindow.setMenu(null)

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('user:login', (event, data) => {
  request({
    'method': 'GET',
    'url': 'https://data.apprdev.tk/auth/SIGNIN',
    'headers': {
      'Authorization': `Basic ${btoa(data.username + ':' + data.password)}`
    }
  }, function (error, response) {
    if (error) throw error;
    event.reply('login-failed', response.body, btoa(data.username + ':' + data.password));
  })
});

ipcMain.on('dashboard:getdata', (event, data) => {
  request({
    'method': 'GET',
    'url': 'https://data.apprdev.tk/queue/DATA',
  }, function (error, response) {
    if (error) throw error;
    event.reply('dashboard-senddata', response.body);
  })
});