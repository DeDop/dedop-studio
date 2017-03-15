import * as electron from "electron";
import installDevToolsExtension from "electron-devtools-installer";
import * as devTools from "electron-devtools-installer";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";
import * as childProcess from "child_process";
import {Configuration} from "./configuration";
import {assignConditionally} from "../common/assign";
import {request} from "./request";
import {error} from "util";

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;
const dialog = electron.dialog;

const PREFS_OPTIONS = ['--prefs', '-p'];
const CONFIG_OPTIONS = ['--config', '-c'];
const DEDOP_STUDIO_PREFIX = 'dedop-studio';

const WEBAPI_INSTALLER_CANCELLED = 1;
const WEBAPI_INSTALLER_ERROR = 2;
const WEBAPI_INSTALLER_MISSING = 3;
const WEBAPI_INSTALLER_BAD_EXIT = 4;
const WEBAPI_ERROR = 5;
const WEBAPI_BAD_EXIT = 6;
const WEBAPI_TIMEOUT = 7;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let _mainWindow;
let _prefs;
let _config;
let _splashWindow;

function getAppIconPath() {
    let icon_file = "linux/16x16.png";
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

function storeConfiguration(config: Configuration, options: string[], defaultConfigFile: string, configType: string) {
    let configFile = getOptionArg(options);
    if (!configFile) {
        configFile = defaultConfigFile;
        let dir = path.dirname(configFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
    config.store(configFile, (err) => {
        if (err) {
            console.error(DEDOP_STUDIO_PREFIX, `${configType} could not be stored in "${configFile}"`, err);
        } else {
            console.log(DEDOP_STUDIO_PREFIX, `${configType} successfully stored in "${configFile}"`);
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

function storeUserPrefs(prefs: Configuration) {
    storeConfiguration(prefs, PREFS_OPTIONS, getDefaultUserPrefsFile(), 'User preferences')
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

    let webAPIConfig = _config.get('webAPIConfig', {});
    webAPIConfig = assignConditionally(webAPIConfig, {
        command: path.join(app.getAppPath(), process.platform === 'win32' ? 'python/Scripts/dedop-webapi.exe' : 'python/bin/dedop-webapi'),
        servicePort: 2999,
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
            app.exit(WEBAPI_ERROR); // exit immediately
        });
        webAPIProcess.on('close', (code: number) => {
            let message = `DeDop WebAPI service process exited with code ${code}.`;
            console.log(DEDOP_STUDIO_PREFIX, message);
            if (code != 0) {
                if (!webAPIError) {
                    electron.dialog.showErrorBox('Internal Error', message);
                }
                webAPIError = new Error(message);
                app.exit(WEBAPI_BAD_EXIT); // exit immediately
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
        showSplashMessage('Starting back-end...');
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
                    app.exit(WEBAPI_TIMEOUT);
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
        checkWebapiServiceExecutable((installerPath: string) => {
            createSplashWindow(() => {
                installWebapiServiceExecutable(installerPath, () => {
                    console.log(DEDOP_STUDIO_PREFIX, 'Ready.');
                    if (!webAPIConfig.useMockService) {
                        console.log(DEDOP_STUDIO_PREFIX, 'Using DeDop WebAPI service...');
                        startUpWithWebapiService();
                    } else {
                        createMainWindow();
                    }
                })
            })
        })
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

function createSplashWindow(callback: () => void) {
    _splashWindow = new BrowserWindow({
        width: 256,
        height: 276,
        center: true,
        useContentSize: true,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
    });
    _splashWindow.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'splash.html'),
        protocol: 'file:',
        slashes: true
    }));
    _splashWindow.on('closed', () => {
        _splashWindow = null;
    });
    _splashWindow.webContents.on('did-finish-load', callback);
}

function createMainWindow() {

    if (_config.data.devToolsExtensions) {
        for (let devToolsExtensionName of _config.data.devToolsExtensions) {
            const devToolExtension = devTools[devToolsExtensionName];
            if (devToolExtension) {
                installDevToolsExtension(devToolExtension)
                    .then((name) => console.log(DEDOP_STUDIO_PREFIX, `Added DevTools extension "${devToolsExtensionName}"`))
                    .catch((err) => console.error(DEDOP_STUDIO_PREFIX, 'Failed to add DevTools extension: ', err));
            }
        }
    }

    const mainWindowBounds = _prefs.data.mainWindowBounds || {width: 800, height: 600};

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
            if (_splashWindow) {
                _splashWindow.close();
            }
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
        }
    );

    // Emitted when the window is going to be closed.
    _mainWindow.on('close', function () {
        _prefs.set('mainWindowBounds', _mainWindow.getBounds());
        _prefs.set('devToolsOpened', _mainWindow.webContents.isDevToolsOpened());
    });

    // Emitted when the window is closed.
    _mainWindow.on('closed', function () {
        storeUserPrefs(_prefs);
        _prefs = null;
        _config = null;
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        _mainWindow = null;
    });

    ipcMain.on('show-open-dialog', (event, openDialogOptions, synchronous?: boolean) => {
        dialog.showOpenDialog(_mainWindow, openDialogOptions, (filePaths: Array<string>) => {
            // console.log('show-open-dialog: filePaths =', filePaths);
            if (synchronous) {
                event.returnValue = filePaths && filePaths.length ? filePaths : null;
            } else {
                event.sender.send('show-open-dialog-reply', filePaths);
            }
        });
    });

    ipcMain.on('show-save-dialog', (event, saveDialogOptions, synchronous?: boolean) => {
        dialog.showSaveDialog(_mainWindow, saveDialogOptions, (filePath: string) => {
            // console.log('show-save-dialog: filePath =', filePath);
            if (synchronous) {
                event.returnValue = filePath ? filePath : null;
            } else {
                event.sender.send('show-save-dialog-reply', filePath);
            }
        });
    });

    ipcMain.on('show-message-box', (event, messageBoxOptions, synchronous?: boolean) => {
        dialog.showMessageBox(_mainWindow, messageBoxOptions, (index: number) => {
            // console.log('show-message-box: index =', index);
            if (synchronous) {
                event.returnValue = index;
            } else {
                event.sender.send('show-message-box-reply', index);
            }
        });
    });

    ipcMain.on('set-preferences', (event, preferences) => {
        _prefs.setAll(preferences);
        // let error;
        // try {
        //     storeUserPrefs(_prefs);
        //     error = null;
        // } catch (e) {
        //     error = e;
        // }
        event.sender.send('set-preferences-reply', error);
    });
}

function showSplashMessage(message: string) {
    console.log(DEDOP_STUDIO_PREFIX, message);
    if (_splashWindow && _splashWindow.isVisible()) {
        _splashWindow.webContents.send('update-splash-message', message);
    } else {
        console.warn(DEDOP_STUDIO_PREFIX, 'showSplashMessage: splash not visible', message);
    }
}

function checkWebapiServiceExecutable(callback: (installerPath?: string) => void): boolean {
    const webAPIConfig = _config.data.webAPIConfig;
    if (fs.existsSync(webAPIConfig.command)) {
        callback();
        return true;
    }

    const fileNames = fs.readdirSync(path.join(app.getAppPath()));
    // console.log('fileNames =', fileNames);
    const isWin = process.platform === 'win32';
    const finder = n => n.startsWith('DeDop-') && (isWin ? (n.endsWith('.exe') || n.endsWith('.bat')) : n.endsWith('.sh'));
    const installerExeName = fileNames.find(finder);
    if (installerExeName) {
        const installerPath = path.join(app.getAppPath(), installerExeName);
        const response = electron.dialog.showMessageBox({
            type: 'info',
            title: 'Dedop - Information',
            buttons: ['Cancel', 'OK'],
            cancelId: 0,
            message: 'About to install missing Dedop back-end.',
            detail: 'It seems that Dedop is run for the first time from this installation.\n' +
            'Dedop will now install a local (Python) back-end which may take\n' +
            'some minutes. This is a one-time job and only applies to this\n' +
            'Dedop installation, no other computer settings will be changed.',
        });
        if (response == 0) {
            electron.app.exit(WEBAPI_INSTALLER_CANCELLED);
            return false;
        } else {
            callback(installerPath);
            return true;
        }
    } else {
        electron.dialog.showMessageBox({
            type: 'error',
            title: 'Dedop - Fatal Error',
            buttons: ['Close'],
            message: 'Can find neither the required Dedop backend service\n"' +
            webAPIConfig.command + '"\n' +
            'nor a bundled Dedop Python installer. Application will exit now.',
        });
        electron.app.exit(WEBAPI_INSTALLER_MISSING);
        return false;
    }
}

function installWebapiServiceExecutable(installerCommand: string, callback: () => void) {

    if (!installerCommand) {
        callback();
        return;
    }

    const isWin = process.platform === 'win32';
    const installDir = path.join(app.getAppPath(), 'python');
    const installerArgs = isWin
        ? ['/S', '/InstallationType=JustMe', '/AddToPath=0', '/RegisterPython=0', `/D=${installDir}`]
        : ['-b', '-f', '-p', installDir];

    console.log(DEDOP_STUDIO_PREFIX, `running WebAPI service installer "${installerCommand}" with arguments ${installerArgs}`);
    showSplashMessage('Running back-end installer, please wait...');
    const installerProcess = childProcess.spawn(installerCommand, installerArgs);

    installerProcess.stdout.on('data', (data: any) => {
        console.log(DEDOP_STUDIO_PREFIX, `${data}`);
    });
    installerProcess.stderr.on('data', (data: any) => {
        console.error(DEDOP_STUDIO_PREFIX, `${data}`);
    });
    installerProcess.on('error', (err: Error) => {
        console.log(DEDOP_STUDIO_PREFIX, 'Dedop WebAPI service installation failed', err);
        electron.dialog.showMessageBox({
            type: 'error',
            title: 'Dedop - Fatal Error',
            message: 'Dedop back-end installation failed.',
            detail: `${err}`
        });
        app.exit(WEBAPI_INSTALLER_ERROR); // exit immediately
    });
    installerProcess.on('close', (code: number) => {
        console.log(DEDOP_STUDIO_PREFIX, `Dedop WebAPI service installation closed with exit code ${code}`);
        if (code == 0) {
            callback();
            return;
        }
        electron.dialog.showMessageBox({
            type: 'error',
            title: 'Dedop - Fatal Error',
            message: `Dedop back-end installation failed with exit code ${code}.`,
        });
        app.exit(WEBAPI_INSTALLER_BAD_EXIT); // exit immediately
    });
    return installerProcess;
}
