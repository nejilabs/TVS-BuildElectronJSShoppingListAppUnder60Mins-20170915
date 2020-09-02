const electron = require('electron');
url = require('url');
path = require('path');

const {app,BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;


//Listen for app to be ready
app.on('ready',function (){
  //create new mainWindow
  mainWindow = new BrowserWindow({
    webPreferences:{
      nodeIntegration:true
    }
  });
  //load html into window
  mainWindow.loadURL(url.format({
    pathname:path.join(__dirname, 'mainWindow.html'),
    protocol:'file',
    slashes:true
  }));

  //Quit app when closed
  mainWindow.on('closed',function(){
    app.quit();
  })

  //Build Menu from Template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert Menu
  Menu.setApplicationMenu(mainMenu);
})


//HANDLE CREATE ADD WINDOW
function createAddWindow(){
  //create new Window
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add Shopping List Item',
    webPreferences:{
      nodeIntegration:true
  }
  });

  //load html into window
  addWindow.loadURL(url.format({
    pathname:path.join(__dirname, 'addWindow.html'),
    protocol:'file',
    slashes:true
  }));

  //Garbage collection handle
  addWindow.on("close",function (){
    addWindow = null;
  });
}


//Catch item:add
ipcMain.on('item:add',function(e,item){
  console.log(item);
  mainWindow.webContents.send('item:add',item);
  addWindow.close();
});


//Create Menu Template
const mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      {
        label:'Add Item',
        accelerator:'Command+A',
        click(){createAddWindow()}
      },
      {
        label:'Clear Items',
        accelerator:'Command+C',
        click(){
          mainWindow.webContents.send('item:clear')
        }
      },
      {
        label:'Quit',
        accelerator:process.platform == 'darwin'? 'Command+Q' : 'Ctrl+Q',
        click(){app.quit()}
      }
    ]
  }
];

//If mac, add empty object to Menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({label:"Electron"});
}

//Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label:"Developer Tools",
    submenu:[
      {
        label:'Toggle DevTools',
        accelerator:process.platform == 'darwin'? 'Command+I' : 'Ctrl+I',
        click(item,focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role:'reload'
      }
    ]
  })
}
