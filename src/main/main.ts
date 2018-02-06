import * as electron from 'electron';
import installDevToolsExtension from 'electron-devtools-installer';
import * as devTools from 'electron-devtools-installer';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import {Configuration} from './configuration';
import {updateConditionally} from '../common/objutil';
import {request} from './request';
import {error} from 'util';
import * as semver from 'semver';
import {pep440ToSemver} from '../common/version';

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;
const dialog = electron.dialog;

/**
 * Identifies the required version of the DeDop WebAPI.
 * The value is a node-semver (https://github.com/npm/node-semver) compatible version range string.
 * @type {string}
 */
export const WEBAPI_VERSION_RANGE = '>=1.4.0 <1.5';

const DEDOP_LOG_FILE_NAME = 'dedop.log';
const DEDOP_WEBAPI_INFO_FILE_NAME = 'webapi-info.json';

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
let _prefsUpdateRequestedOnClose = false;
let _prefsUpdatedOnClose = false;

function getAppIconPath() {
    let icon_file = 'linux/16x16.png';
    if (process.platform === 'darwin') {
        icon_file = 'darwin/dedop.icns';
    } else if (process.platform === 'win32') {
        icon_file = 'win32/dedop.ico';
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

function loadBackendLocation() {
    const dataDir = getAppDataDir();
    if (!fs.existsSync(dataDir)) {
        // Return immediately if there is no dataDir (yet).
        return null;
    }

    const fileNames = fs.readdirSync(dataDir);
    const backendLocations = {};
    for (let fileName of fileNames) {
        const locationFile = path.join(dataDir, fileName, 'dedop.location');
        if (fs.existsSync(locationFile)) {
            let location = fs.readFileSync(locationFile, 'utf8');
            if (location) {
                location = location.trim();
                const webApiExe = path.join(location, process.platform === 'win32' ? 'Scripts\\dedop-webapi.exe' : 'bin/dedop-webapi');
                if (fs.existsSync(webApiExe)) {
                    const version = pep440ToSemver(fileName);
                    if (semver.valid(version, true)) {
                        // Return immediately if the versions are equal.
                        if (semver.eq(version, app.getVersion(), true)) {
                            return webApiExe;
                        }
                        backendLocations[version] = webApiExe;
                    }
                }
            }
        }
    }

    let descendingVersions = Object.getOwnPropertyNames(backendLocations);
    descendingVersions.sort((v1: string, v2: string) => semver.compare(v2, v1, true));

    for (let version of descendingVersions) {
        if (semver.satisfies(version, WEBAPI_VERSION_RANGE, true)) {
            return backendLocations[version];
        }
    }

    return null;
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

function writeToLogFile(message) {
    const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
    fs.appendFileSync(path.join(getAppDataDir(), DEDOP_LOG_FILE_NAME), new Date(Date.now() - timeZoneOffset).toISOString() + ': ' + message + '\n');
}

export function init() {
    writeToLogFile('============ DeDo Studio starts ============');
    _config = loadAppConfig();
    _prefs = loadUserPrefs();

    let webAPIConfig = _config.get('webAPIConfig', {});
    const webApiInfoPath = path.join(getAppDataDir(), DEDOP_WEBAPI_INFO_FILE_NAME);
    webAPIConfig = updateConditionally(webAPIConfig, {
        servicePort: 2999,
        serviceAddress: '',
        serviceFile: webApiInfoPath,
        // Refer to https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
        processOptions: {},
    });
    writeToLogFile('Setting up webAPI with default configuration: ' + JSON.stringify(webAPIConfig));

    const backendLocation = loadBackendLocation();
    if (backendLocation) {
        writeToLogFile('Backend location found: ' + backendLocation);
        webAPIConfig = updateConditionally(webAPIConfig, {
            command: backendLocation
        });
    }
    _config.set('webAPIConfig', webAPIConfig);

    console.log(DEDOP_STUDIO_PREFIX, 'appConfig:', _config.data);
    writeToLogFile('appConfig:' + JSON.stringify(_config.data));
    console.log(DEDOP_STUDIO_PREFIX, 'userPrefs:', _prefs.data);
    writeToLogFile('userPrefs:' + JSON.stringify(_prefs.data));

    let webAPIStarted = false;
    // Remember error occurred so
    let webAPIError = null;

    let webAPIProcess = null;

    function startWebapiService(): childProcess.ChildProcess {
        const webAPIStartArgs = getWebAPIStartArgs(webAPIConfig);
        console.log(DEDOP_STUDIO_PREFIX, `Starting DeDop WebAPI service using arguments: ${webAPIStartArgs}`);
        writeToLogFile(`Starting DeDop WebAPI service using arguments: ${webAPIStartArgs}`);
        writeToLogFile('webAPIConfig:' + JSON.stringify(webAPIConfig));
        const webAPIProcess = childProcess.spawn(webAPIConfig.command, webAPIStartArgs, webAPIConfig.processOptions);
        webAPIStarted = true;
        webAPIProcess.stdout.on('data', (data: any) => {
            console.log(DEDOP_STUDIO_PREFIX, `${data}`);
        });
        webAPIProcess.stderr.on('data', (data: any) => {
            console.error(DEDOP_STUDIO_PREFIX, `${data}`);
        });
        webAPIProcess.on('error', (err: Error) => {
            console.error(DEDOP_STUDIO_PREFIX, err);
            if (!webAPIError) {
                writeToLogFile(`Internal Error - Failed to start DeDop WebAPI service.`);
                electron.dialog.showErrorBox(`${app.getName()} - Internal Error`,
                    'Failed to start DeDop WebAPI service.');
            }
            webAPIError = err;
            app.exit(WEBAPI_ERROR); // exit immediately
        });
        webAPIProcess.on('close', (code: number) => {
            let message = `DeDop WebAPI service process exited with code ${code}.`;
            console.log(DEDOP_STUDIO_PREFIX, message);
            writeToLogFile(message);
            if (code != 0) {
                if (!webAPIError) {
                    electron.dialog.showErrorBox(`${app.getName()} - Internal Error`, message);
                }
                webAPIError = new Error(message);
                writeToLogFile('Internal Error - ' + message);
                app.exit(WEBAPI_BAD_EXIT); // exit immediately
            }
        });
        return webAPIProcess;
    }

    function stopWebapiService(webAPIProcess) {
        if (!webAPIProcess) {
            return;
        }
        // Note we are async here, because sync can take a lot of time...
        const webAPIStopArgs = getWebAPIStopArgs(webAPIConfig);
        console.log(DEDOP_STUDIO_PREFIX, `Stopping DeDop WebAPI service using arguments: ${webAPIStopArgs}`);
        writeToLogFile(`Stopping DeDop WebAPI service using arguments: ${webAPIStopArgs}`);
        childProcess.spawn(webAPIConfig.command, webAPIStopArgs, webAPIConfig.processOptions);
    }

    function startUpWithWebapiService() {
        const msServiceAccessTimeout = 1000; // ms
        const msServiceStartTimeout = 5000; // ms
        const msDelay = 500; // ms
        let msSpend = 0; // ms
        let webAPIRestUrl = getWebAPIRestUrl(_config.data.webAPIConfig);
        console.log(DEDOP_STUDIO_PREFIX, `Waiting for response from ${webAPIRestUrl}`);
        writeToLogFile(`Waiting for response from ${webAPIRestUrl}`);
        showSplashMessage('Waiting for DeDop backend service...');
        request(webAPIRestUrl, msServiceAccessTimeout)
            .then((response: string) => {
                console.log(DEDOP_STUDIO_PREFIX, `Response: ${response}`);
                writeToLogFile(`Response: ${response}`);
                createMainWindow();
            })
            .catch((err) => {
                console.log(DEDOP_STUDIO_PREFIX, `Waiting for DeDop WebAPI service to respond after ${msSpend} ms`);
                writeToLogFile(`Waiting for DeDop WebAPI service to respond after ${msSpend} ms`);
                if (!webAPIStarted) {
                    webAPIProcess = startWebapiService();
                }
                if (msSpend > msServiceStartTimeout) {
                    console.error(DEDOP_STUDIO_PREFIX, `Failed to start DeDop WebAPI service within ${msSpend} ms.`);
                    console.log(DEDOP_STUDIO_PREFIX, `Failed to start DeDop WebAPI service within ${msSpend} ms.`);
                    if (!webAPIError) {
                        electron.dialog.showErrorBox(`${app.getName()} - Internal Error`, `Failed to start DeDop backend service within ${msSpend} ms.`);
                    }
                    app.exit(WEBAPI_TIMEOUT);
                } else {
                    setTimeout(startUpWithWebapiService, msDelay);
                    msSpend += msDelay;
                }
            });
    }

    // Emitted when Electron has finished initializing.
    app.on('ready', (): void => {
        checkWebapiServiceExecutable((installerPath: string) => {
            createSplashWindow(() => {
                installBackend(installerPath, () => {
                    console.log(DEDOP_STUDIO_PREFIX, 'Ready.');
                    startUpWithWebapiService();
                });
            });
        });
    });

    // Emitted when all windows have been closed and the application will quit.
    app.on('quit', () => {
        console.log(DEDOP_STUDIO_PREFIX, 'Quit.');
        stopWebapiService(webAPIProcess);
        writeToLogFile('============ DeDo Studio exits ============');
    });

    // Emitted when all windows have been closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            writeToLogFile('Close app in OSX');
            app.quit();
        }
    });

    // OS X: Emitted when the application is activated, which usually happens when the user clicks
    // on the application's dock icon.
    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (_mainWindow === null) {
            // TODO (forman): must find out what Mac OS expects an app to do, once it becomes deactivated
            //   - is it a complete restart or should it remain in its previous state?
            //   - must we stop the webapi on "deactivate" and start on "activate"?
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

function showSplashMessage(message: string) {
    console.log(DEDOP_STUDIO_PREFIX, message);
    if (_splashWindow && _splashWindow.isVisible()) {
        _splashWindow.webContents.send('update-splash-message', message);
    } else {
        console.warn(DEDOP_STUDIO_PREFIX, 'showSplashMessage: splash not visible', message);
    }
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

    showSplashMessage('Loading user interface...');

    const mainWindowBounds = _prefs.data.mainWindowBounds || {width: 1366, height: 768};

    _mainWindow = new BrowserWindow(Object.assign({
        icon: getAppIconPath(),
        title: `${app.getName()} ${app.getVersion()}`,
        webPreferences: {},
    }, mainWindowBounds));

    // disable the top toolbar menu as it is not used yet
    _mainWindow.setMenu(null);

    _mainWindow.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    _mainWindow.webContents.on('did-finish-load', () => {
        showSplashMessage('Done.');
        console.log(DEDOP_STUDIO_PREFIX, 'Main window UI loaded.');
        writeToLogFile('Main window UI loaded.');
        if (_splashWindow) {
            _splashWindow.close();
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
    });

    if (_prefs.data.devToolsOpened) {
        // Open the DevTools.
        _mainWindow.webContents.openDevTools();
    }

    // Emitted when the web page has been rendered and window can be displayed without a visual flash.
    _mainWindow.on('ready-to-show', () => {
        console.log(DEDOP_STUDIO_PREFIX, 'Main window is ready to show.');
        writeToLogFile('Main window is ready to show.');
    });

    // Emitted when the window is going to be closed.
    _mainWindow.on('close', (event) => {
        if (!_prefsUpdateRequestedOnClose) {
            _prefsUpdateRequestedOnClose = true;
            event.preventDefault();
            console.log(DEDOP_STUDIO_PREFIX, 'Main window is going to be closed, fetching user preferences...');
            writeToLogFile('Main window is going to be closed, fetching user preferences...');
            _prefs.set('mainWindowBounds', _mainWindow.getBounds());
            _prefs.set('devToolsOpened', _mainWindow.webContents.isDevToolsOpened());
            event.sender.send('get-preferences');
        } else if (!_prefsUpdatedOnClose) {
            event.preventDefault();
        }
    });

    // Emitted when the window is closed.
    _mainWindow.on('closed', () => {
        console.log(DEDOP_STUDIO_PREFIX, 'Main window closed.');
        writeToLogFile('Main window closed.');
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
            if (synchronous) {
                event.returnValue = filePaths && filePaths.length ? filePaths : null;
            } else {
                event.sender.send('show-open-dialog-reply', filePaths);
            }
        });
    });

    ipcMain.on('show-save-dialog', (event, saveDialogOptions, synchronous?: boolean) => {
        dialog.showSaveDialog(_mainWindow, saveDialogOptions, (filePath: string) => {
            if (synchronous) {
                event.returnValue = filePath ? filePath : null;
            } else {
                event.sender.send('show-save-dialog-reply', filePath);
            }
        });
    });

    ipcMain.on('show-message-box', (event, messageBoxOptions, synchronous?: boolean) => {
        dialog.showMessageBox(_mainWindow, messageBoxOptions, (index: number) => {
            if (synchronous) {
                event.returnValue = index;
            } else {
                event.sender.send('show-message-box-reply', index);
            }
        });
    });

    ipcMain.on('set-preferences', (event, preferences) => {
        _prefs.setAll(preferences);
        if (_prefsUpdateRequestedOnClose) {
            _prefsUpdatedOnClose = true;
            app.quit();
        } else {
            event.sender.send('set-preferences-reply', error);
        }
    });
}

function checkWebapiServiceExecutable(callback: (installerPath?: string) => void): boolean {
    const webAPIConfig = _config.data.webAPIConfig;
    if (fs.existsSync(webAPIConfig.command)) {
        callback();
        return true;
    }

    const fileNames = fs.readdirSync(app.getAppPath());
    const isWin = process.platform === 'win32';
    const finder = n => n.startsWith('DeDop-core') && (isWin ? (n.endsWith('.exe') || n.endsWith('.bat')) : n.endsWith('.sh'));
    const installerExeName = fileNames.find(finder);
    if (installerExeName) {
        const installerPath = path.join(app.getAppPath(), installerExeName);
        const response = electron.dialog.showMessageBox({
            type: 'info',
            title: `${app.getName()} - Information`,
            buttons: ['Cancel', 'OK'],
            cancelId: 0,
            message: 'About to install missing DeDop backend.',
            detail: 'It seems that DeDop is run for the first time from this installation.\n' +
            'DeDop will now install a local (Python) backend which may take\n' +
            'some minutes. This is a one-time job and only applies to this\n' +
            'DeDop installation, no other computer settings will be changed.',
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
            title: `${app.getName()} - Fatal Error`,
            buttons: ['Close'],
            message: 'Can find neither the required DeDop backend service\n"' +
            webAPIConfig.command + '"\n' +
            'nor a bundled DeDop Python installer. Application will exit now.',
        });
        electron.app.exit(WEBAPI_INSTALLER_MISSING);
        return false;
    }
}

function installBackend(installerCommand: string, callback: () => void) {

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
    writeToLogFile(`running WebAPI service installer "${installerCommand}" with arguments ${installerArgs}`);
    showSplashMessage('Running backend installer, please wait...');
    const installerProcess = childProcess.spawn(installerCommand, installerArgs);

    installerProcess.stdout.on('data', (data: any) => {
        console.log(DEDOP_STUDIO_PREFIX, `${data}`);
    });
    installerProcess.stderr.on('data', (data: any) => {
        console.error(DEDOP_STUDIO_PREFIX, `${data}`);
    });
    installerProcess.on('error', (err: Error) => {
        console.log(DEDOP_STUDIO_PREFIX, 'DeDop WebAPI service installation failed', err);
        writeToLogFile('DeDop WebAPI service installation failed: ' + err);
        electron.dialog.showMessageBox({
            type: 'error',
            title: `${app.getName()} - Fatal Error`,
            message: 'DeDop WebAPI service installation failed.',
            detail: `${err}`
        });
        app.exit(WEBAPI_INSTALLER_ERROR); // exit immediately
    });
    installerProcess.on('close', (code: number) => {
        console.log(DEDOP_STUDIO_PREFIX, `DeDop WebAPI service installation closed with exit code ${code}`);
        writeToLogFile(`DeDop WebAPI service installation closed with exit code ${code}`);
        if (code == 0) {
            callback();
            return;
        }
        electron.dialog.showMessageBox({
            type: 'error',
            title: `${app.getName()} - Fatal Error`,
            message: `DeDop WebAPI service installation failed with exit code ${code}.`,
        });
        app.exit(WEBAPI_INSTALLER_BAD_EXIT); // exit immediately
    });
    return installerProcess;
}
