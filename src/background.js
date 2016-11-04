// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import {app, Menu} from 'electron';
import {devMenuTemplate} from './menu/dev_menu_template';
import {editMenuTemplate} from './menu/edit_menu_template';
import createWindow from './helpers/window';
const path = require('path');

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

var getIconFile = function () {
    var icon_file = "dedop.ico";
    if (process.platform === "darwin") {
        icon_file = "dedop.icns";
    } else if (process.platform === "win32") {
        icon_file = "dedop.ico";
    }
    return icon_file;
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    var userDataPath = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
    setApplicationMenu();

    var icon_file = getIconFile();
    var mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
        icon: path.join(__dirname, 'resources', 'icons', icon_file)
    });

    mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (env.name === 'development') {
        mainWindow.openDevTools();
    }
});

app.on('window-all-closed', function () {
    app.quit();
});
