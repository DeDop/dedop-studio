import * as electron from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import {Config} from "./Config";
import * as childProcess from 'child_process';

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let _mainWindow;
let _prefs;
let _config;
let installFinished = false;

function getAppIconPath() {
    let icon_file = "dedop-16.png";
    if (process.platform === "darwin") {
        icon_file = "darwin/dedop.icns";
    } else if (process.platform === "win32") {
        icon_file = "win32/dedop.ico";
    }
    return path.join(app.getAppPath(), 'resources', icon_file);
}

function getAppDataDir() {
    return path.join(app.getPath('home'), '.dedop');
}

function getConfigFile() {
    let file = getOptionArg(['--config', '-c']);
    if (file) {
        return file;
    }
    file = path.resolve('dedop-config.js');
    return fs.existsSync(file) ? file : null;
}

function getPrefsFile() {
    let file = getOptionArg(['--prefs', '-p']);
    if (file) {
        return file;
    }
    return path.join(getAppDataDir(), 'dedop-prefs.json');
}

function getOptionArg(options: string[]) {
    let args: Array<string> = process.argv.slice(1);
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (options.indexOf(arg) > -1 && i < args.length - 1) {
            return args[i + 1];
        }
    }
    return null;
}

function storePrefs() {
    let stats = fs.statSync(getAppDataDir());
    if (!stats.isDirectory()) {
        fs.mkdirSync(getAppDataDir());
    }
    let prefsFile = getPrefsFile();
    _prefs.store(prefsFile, (err) => {
        if (err) {
            console.log('failed to store preferences to ', prefsFile, err);
        } else {
            console.log('preferences stored to ', prefsFile);
        }
    });
}

function loadPrefs(): Config {
    let prefs = new Config();
    let prefsFile = getPrefsFile();
    prefs.load(prefsFile, (err) => {
        if (err) {
            console.error('failed to load preferences from ', prefsFile, err);
        } else {
            console.log('preferences loaded from ', prefsFile);
        }
    });
    return prefs;
}

function loadConfig(): Config {
    let config = new Config();
    let configFile = getConfigFile();
    if (config) {
        config.load(configFile, (err) => {
            if (err) {
                console.error('failed to load configuration from ', configFile, err);
            } else {
                console.log('configuration loaded from ', configFile);
            }
        });
    }
    return config;
}

export function init() {
    _prefs = loadPrefs();
    _config = loadConfig();

    // ==================== dedop-core installation (deactivated for now) =======================================
    // let installerPath;
    // let installerFile;
    // let commandArgs;
    // let initializeDedopCommand;
    //
    // const dedopHome = path.join(app.getAppPath(), 'dedop-core', 'installed');
    //
    // if (process.platform === "darwin") {
    //     console.log("configure dedop-core installation for MacOS");
    // } else if (process.platform === "linux") {
    //     console.log("configure dedop-core installation for Linux");
    // } else if (process.platform === "win32") {
    //     installerPath = path.join(app.getAppPath(), 'dedop-core', 'win');
    //
    //     let files = fs.readdirSync(installerPath);
    //     for (let i = 0; i < files.length; i++) {
    //         if (files[i].endsWith('.exe')) {
    //             installerFile = files[i];
    //         }
    //     }
    //     commandArgs = ' /AddToPath=0 /RegisterPython=0 /S /D=' + dedopHome + '';
    //     initializeDedopCommand = 'Scripts\\activate.bat && conda env list && dedop -h';
    // }
    //
    // const installerFullPath = path.join(installerPath, installerFile);

    // // refer to http://conda.pydata.org/docs/help/silent.html for silent mode installation
    // childProcess.exec(installerFullPath + commandArgs, function (code, stdout, stderr) {
    //     if (!stderr) {
    //         installFinished = true;
    //         console.log("dedop-core installation finished...");
    //         console.log(childProcess.execSync(initializeDedopCommand, {cwd: dedopHome}).toString());
    //     } else {
    //         console.log("dedop-core installation was not successful...", stderr, stdout);
    //     }
    // });
    // console.log(installFinished);

    // ==================== dedop-core installation (deactivated for now) =======================================

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createMainWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (_mainWindow === null) {
            createMainWindow();
        }
    });

    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and require them here.
}

function createMainWindow() {

    if (_config.data.devToolsExtensions) {
        for (let path of _config.data.devToolsExtensions) {
            BrowserWindow.addDevToolsExtension(path);
            console.log('added DevTools extension: ', path);
        }
    }

    let mainWindowBounds = _prefs.data.mainWindowBounds;
    if (!mainWindowBounds) {
        mainWindowBounds = {
            width: 800,
            height: 600,
        };
    }

    // Create the browser window.
    _mainWindow = new BrowserWindow(Object.assign({
        icon: getAppIconPath(),
        webPreferences: {},
    }, mainWindowBounds));

    // and load the index.html of the app.
    _mainWindow.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    if (_config.data.devToolsOpened) {
        // Open the DevTools.
        _mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is going to be closed.
    _mainWindow.on('close', function () {
        _prefs.set('mainWindowBounds', _mainWindow.getBounds());
        _prefs.set('devToolsOpened', _mainWindow.webContents.isDevToolsOpened());
    });

    // Emitted when the window is closed.
    _mainWindow.on('closed', function () {
        storePrefs();
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        _mainWindow = null;
    });
}

