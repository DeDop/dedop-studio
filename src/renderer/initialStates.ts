import {Configuration, ControlState, DataState} from "./state";

export const initialControlState: ControlState = {
    sourceFiles: [],
    globalAttributes: [],
    mainPanelTitle: null,
    selectedConfigurationName: "default",
    currentConfigurationTabPanel: 0,
    currentConfigurationName: "default",
    currentMainTabPanel: 0,
    codeEditorActive: false,
    currentSourceFileDirectory: "",
    selectedSourceType: "single",
    processName: ""
};

export const initialDataState: DataState = {
    processes: [],
    appConfig: {
        webAPIClient: null,
        webAPIConfig: {
            servicePort: 2999,
            serviceAddress: '127.0.0.1',
            restUrl: 'ws://127.0.0.1:2999/',
            webSocketUrl: 'ws://127.0.0.1:2999/app'
        }
    },
    workspaces: []
};

export const mainTabs: string[] = [
    "Source Data",
    "Configuration",
    "Processing",
    "Result & Analysis"
];
