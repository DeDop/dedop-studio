import * as electron from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";
import * as childProcess from "child_process";
import {Configuration} from "./configuration";
import {assignConditionally} from "../common/assign";
import {request} from "./request";

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const PREFS_OPTIONS = ['--prefs', '-p'];
const CONFIG_OPTIONS = ['--config', '-c'];
const DEDOP_STUDIO_PREFIX = 'dedop-studio';

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

function loadConfiguration(options: string[], defaultConfigFile: string, configType: string): Configuration {
    let config = new Configuration();
    let configFile = getOptionArg(options);
    if (!configFile) {
        configFile = defaultConfigFile;
        if (!fs.existsSync(configFile)) {
            return config;
        }
    }
    config.load(configFile, (err) => {
        if (err) {
            console.error(DEDOP_STUDIO_PREFIX, `${configType} could not be loaded from "${configFile}"`, err);
        } else {
            console.log(DEDOP_STUDIO_PREFIX, `${configType} successfully loaded from "${configFile}"`);
        }
    });
    return config;
}

function getDefaultUserPrefsFile() {
    if (_config.data.prefsFile) {
        return _config.data.prefsFile;
    }
    return path.join(getAppDataDir(), 'dedop-prefs.json');
}

function loadAppConfig(): Configuration {
    return loadConfiguration(CONFIG_OPTIONS, path.resolve('dedop-config.js'), 'App configuration');
}

function loadUserPrefs(): Configuration {
    return loadConfiguration(PREFS_OPTIONS, getDefaultUserPrefsFile(), 'User preferences');
}

function getWebAPICommonArgs(webAPIConfig) {
    return [
        '--caller', 'dedop-studio',
        '--port', webAPIConfig.servicePort,
        '--address', webAPIConfig.serviceAddress,
        '--file', webAPIConfig.serviceFile,
    ];
}

function getWebAPIStartArgs(webAPIConfig) {
    return getWebAPICommonArgs(webAPIConfig).concat('start');
}

function getWebAPIStopArgs(webAPIConfig) {
    return getWebAPICommonArgs(webAPIConfig).concat('stop');
}

function getWebAPIRestUrl(webAPIConfig) {
    return `http://${webAPIConfig.serviceAddress || '127.0.0.1'}:${webAPIConfig.servicePort}/`;
}

function getWebAPIWebSocketsUrl(webAPIConfig) {
    return `ws://${webAPIConfig.serviceAddress || '127.0.0.1'}:${webAPIConfig.servicePort}/app`;
}

export function init() {
    _config = loadAppConfig();
    _prefs = loadUserPrefs();

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

    let webAPIConfig = _config.get('webAPIConfig', {});
    webAPIConfig = assignConditionally(webAPIConfig, {
        command: path.join(app.getAppPath(), process.platform === 'win32' ? 'python/Scripts/dedop-webapi.exe' : 'python/bin/dedop-webapi'),
        servicePort: 9090,
        serviceAddress: '',
        serviceFile: 'dedop-webapi.json',
        // Refer to https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
        processOptions: {},
        useMockService: false,
    });

    _config.set('webAPIConfig', webAPIConfig);

    console.log(DEDOP_STUDIO_PREFIX, 'appConfig:', _config.data);
    console.log(DEDOP_STUDIO_PREFIX, 'userPrefs:', _prefs.data);

    let webAPIStarted = false;
    // Remember error occurred so
    let webAPIError = null;

    let webAPIProcess = null;

    function startWebapiService(): childProcess.ChildProcess {
        const webAPIStartArgs = getWebAPIStartArgs(webAPIConfig);
        console.log(DEDOP_STUDIO_PREFIX, `starting DeDop WebAPI service using arguments: ${webAPIStartArgs}`);
        const webAPIProcess = childProcess.spawn(webAPIConfig.command, webAPIStartArgs, webAPIConfig.processOptions);
        webAPIStarted = true;
        webAPIProcess.stdout.on('data', (data: any) => {
            console.log(DEDOP_STUDIO_PREFIX, `${data}`);
        });
        webAPIProcess.stderr.on('data', (data: any) => {
            console.error(DEDOP_STUDIO_PREFIX, `${data}`);
        });
        webAPIProcess.on('error', (err: Error) => {
            let message = 'Failed to start DeDop WebAPI service.';
            console.log(DEDOP_STUDIO_PREFIX, message, err);
            if (!webAPIError) {
                electron.dialog.showErrorBox('Internal Error', message);
            }
            webAPIError = err;
            // exit immediately
            app.exit(1);
        });
        webAPIProcess.on('close', (code: number) => {
            let message = `DeDop WebAPI service process exited with code ${code}.`;
            console.log(DEDOP_STUDIO_PREFIX, message);
            if (code != 0) {
                if (!webAPIError) {
                    electron.dialog.showErrorBox('Internal Error', message);
                }
                webAPIError = new Error(message);
                // exit immediately
                app.exit(2);
            }
        });
        return webAPIProcess;
    }

    function startUpWithWebapiService() {
        const msServiceAccessTimeout = 1000; // ms
        const msServiceStartTimeout = 5000; // ms
        const msDelay = 500; // ms
        let msSpend = 0; // ms
        let webAPIRestUrl = getWebAPIRestUrl(_config.data.webAPIConfig);
        console.log(DEDOP_STUDIO_PREFIX, `Waiting for response from ${webAPIRestUrl}`);
        request(webAPIRestUrl, msServiceAccessTimeout)
            .then((response: string) => {
                console.log(DEDOP_STUDIO_PREFIX, `Response: ${response}`);
                createMainWindow();
            })
            .catch((err) => {
                console.log(DEDOP_STUDIO_PREFIX, `No response within ${msServiceAccessTimeout} ms. Error: `, err);
                if (!webAPIStarted) {
                    webAPIProcess = startWebapiService();
                }
                if (msSpend > msServiceStartTimeout) {
                    let message = `Failed to start DeDop WebAPI service within ${msSpend} ms.`;
                    console.error(DEDOP_STUDIO_PREFIX, message, err);
                    if (!webAPIError) {
                        electron.dialog.showErrorBox("Internal Error", message);
                    }
                    webAPIError = new Error(message);
                    app.exit(2);
                } else {
                    setTimeout(startUpWithWebapiService, msDelay);
                    msSpend += msDelay;
                }
            });
    }

    function stopWebapiService(webAPIProcess) {
        if (!webAPIProcess) {
            return;
        }
        // Note we are async here, because sync can take a lot of time...
        const webAPIStopArgs = getWebAPIStopArgs(webAPIConfig);
        childProcess.spawn(webAPIConfig.command, webAPIStopArgs, webAPIConfig.processOptions);
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', (): void => {
        console.log(DEDOP_STUDIO_PREFIX, 'Ready.');
        if (!webAPIConfig.useMockService) {
            console.log(DEDOP_STUDIO_PREFIX, 'Using DeDop WebAPI service...');
            startUpWithWebapiService();
        } else {
            createMainWindow();
        }
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    // Emitted when all windows have been closed and the application will quit.
    app.on('quit', () => {
        console.log(DEDOP_STUDIO_PREFIX, 'Quit.');
        if (!webAPIConfig.useMockService) {
            stopWebapiService(webAPIProcess);
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

    _mainWindow.webContents.on('did-finish-load', () => {
        console.log(DEDOP_STUDIO_PREFIX, 'Main window UI loaded.');

        const webAPIConfig = _config.data.webAPIConfig;
        _mainWindow.webContents.send('apply-initial-state', {
            session: _prefs.data,
            appConfig: Object.assign({}, _config.data, {
                appPath: app.getAppPath(),
                webAPIConfig: Object.assign({}, webAPIConfig, {
                    restUrl: getWebAPIRestUrl(webAPIConfig),
                    webSocketUrl: getWebAPIWebSocketsUrl(webAPIConfig),
                }),
            })
        });
    });

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

