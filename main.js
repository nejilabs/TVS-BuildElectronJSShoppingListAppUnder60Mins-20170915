const electron = require('electron');
url = require('url');
path = require('path');

const {app,BrowserWindow, Menu} = electron;

let mainWindow;

//Listen for app to be ready
app.on('ready',function (){
  //create new mainWindow
  mainWindow = new BrowserWindow({});
  //load html into window
  mainWindow.loadURL(url.format({
    pathname:path.join(__dirname, 'mainWindow.html'),
    protocol:'file',
    slashes:true
  }));

  //Build Menu from Template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert Menu
  Menu.setApplicationMenu(mainMenu);
})


//Create Menu Template
const mainMenuTemplate = [
  {
    label:'file',
    submenu:[
      {label:'Add Item'},
      {label:'Clear Items'},
      {
        label:'Quit',
        accelerator:process.platform == 'darwin'? 'Command+Q' : 'Ctrl+Q',
        click(){app.quit()}
      }
    ]
  }
]
