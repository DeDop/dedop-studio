import {
    ControlState,
    State,
    DataState,
    Configuration,
    ProcessConfigurations,
    CommunicationState,
    Workspace
} from "./state";
import * as actions from "./actions";
import {combineReducers} from "redux";
import {
    initialControlState,
    initialDataState,
    defaultChdConfigurations,
    defaultCnfConfigurations,
    defaultCstConfigurations
} from "./initialStates";

function getSelectedConfigurations(baseConfigurationName: string, configurations: Configuration[]): {chd: ProcessConfigurations, cnf: ProcessConfigurations, cst: ProcessConfigurations} {
    for (let i in configurations) {
        if (configurations[i].name == baseConfigurationName) {
            return {
                chd: configurations[i].chd,
                cnf: configurations[i].cnf,
                cst: configurations[i].cst
            }
        }
    }
    return {
        chd: defaultChdConfigurations,
        cnf: defaultCnfConfigurations,
        cst: defaultCstConfigurations
    }

}

const dataReducer = (state: DataState = initialDataState, action) => {

    switch (action.type) {
        case actions.ADD_CONFIG_NAME: {
            const index = state.workspaces.findIndex((x) => x.name === action.payload.workspaceName);
            const workspace = state.workspaces[index];
            const updatedWorkspace = Object.assign({}, workspace, {
                configs: [
                    ...workspace.configs,
                    {
                        name: action.payload.newConfigurationName,
                        lastUpdated: action.payload.currentTime
                    }
                ]
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, index),
                    updatedWorkspace,
                    ...state.workspaces.slice(index + 1)
                ]
            });
        }
        case actions.UPDATE_CONFIG_NAME: {
            const index = state.configurations.findIndex((x) => x.name === action.payload.oldConfigurationName);
            const updatedConfigurations = Object.assign({}, state.configurations[index], {
                name: action.payload.newConfigurationName,
                lastUpdated: action.payload.currentTime
            });
            return Object.assign({}, state, {
                ...state,
                configurations: [
                    ...state.configurations.slice(0, index),
                    updatedConfigurations,
                    ...state.configurations.slice(index + 1),
                ],
            });
        }
        case actions.DELETE_CONFIG_NAME: {
            const configName = action.payload;
            const index = state.configurations.findIndex((x) => x.name === configName);
            return Object.assign({}, state, {
                configurations: [
                    ...state.configurations.slice(0, index),
                    ...state.configurations.slice(index + 1)
                ]
            });
        }
        case actions.SAVE_CONFIGURATION: {
            const configName = action.payload.activeConfiguration;
            const index = state.configurations.findIndex((x) => x.name === configName);
            const oldConfiguration = state.configurations[index];
            const newConfiguration = Object.assign({}, oldConfiguration, {
                chd: action.payload.chd,
                cnf: action.payload.cnf,
                cst: action.payload.cst,
                name: configName,
                lastUpdated: action.payload.currentTime
            });
            return Object.assign({}, state, {
                configurations: [
                    ...state.configurations.slice(0, index),
                    newConfiguration,
                    ...state.configurations.slice(index + 1)
                ]
            });
        }
        case actions.ADD_SOURCE_FILE: {
            const index = state.workspaces.findIndex((x) => x.name === action.payload.workspaceName);
            const workspace = state.workspaces[index];
            const updatedWorkspace = Object.assign({}, workspace, {
                inputs: [
                    ...workspace.inputs,
                    ...action.payload.sourceFile
                ]
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, index),
                    updatedWorkspace,
                    ...state.workspaces.slice(index + 1),
                ]
            })
        }
        case actions.REMOVE_SOURCE_FILE: {
            const index = state.workspaces.findIndex((x) => x.name === action.payload.workspaceName);
            const workspace = state.workspaces[index];
            const inputFileIndex = workspace.inputs.findIndex((x) => x.name === action.payload.sourceFileName);
            const updatedWorkspace = Object.assign({}, workspace, {
                inputs: [
                    ...workspace.inputs.slice(0, inputFileIndex),
                    ...workspace.inputs.slice(inputFileIndex + 1)
                ]
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, index),
                    updatedWorkspace,
                    ...state.workspaces.slice(index + 1),
                ]
            })
        }
        case actions.ADD_NEW_PROCESS: {
            return Object.assign({}, state, {
                processes: [
                    ...state.processes,
                    action.payload
                ]
            })
        }
        case actions.APPLY_INITIAL_STATE: {
            return Object.assign({}, state, {
                appConfig: action.payload.appConfig
            });
        }
        case actions.SET_WEBAPI_STATUS: {
            const webAPIClient = action.payload.webAPIClient;
            const newAppConfig = Object.assign({}, state.appConfig, {webAPIClient});
            return Object.assign({}, state, {
                appConfig: newAppConfig
            });
        }
        case actions.ADD_WORKSPACE: {
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces,
                    action.payload
                ]
            });
        }
        case actions.UPDATE_WORKSPACES: {
            let newWorkspaces: Workspace[] = [];
            if (state.workspaces.length > 0) {
                for (let i in state.workspaces) {
                    const index = state.workspaces.findIndex((x) => x.name == action.payload[i].name);
                    if (index < 0) {
                        newWorkspaces.push(action.payload[i])
                    }
                }
            } else {
                newWorkspaces = action.payload;
            }
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces,
                    ...newWorkspaces
                ]
            });
        }
        case actions.RENAME_WORKSPACE: {
            const index = state.workspaces.findIndex((x) => x.name === action.payload.oldWorkspaceName);
            const newWorkspace = {
                ...state.workspaces[index],
                name: action.payload.newWorkspaceName
            };
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, index),
                    newWorkspace,
                    ...state.workspaces.slice(index + 1)
                ]
            });
        }
        case actions.REMOVE_WORKSPACE: {
            const index = state.workspaces.findIndex((x) => x.name === action.payload);
            return Object.assign({}, state, {
                workspaceNames: [
                    ...state.workspaces.slice(0, index),
                    ...state.workspaces.slice(index + 1)
                ]
            });
        }
        case actions.UPDATE_WORKSPACE_SOURCE_FILES: {
            let workspaceIndex = state.workspaces.findIndex((x) => x.name === action.payload.workspace.name);
            let newWorkspace = Object.assign({}, action.payload.workspace, {
                inputs: action.payload.sourceFiles
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    newWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.UPDATE_CONFIGS: {
            let workspaceIndex = state.workspaces.findIndex((x) => x.name === action.payload.workspaceName);
            const workspace = state.workspaces[workspaceIndex];
            let newConfigs: Configuration[] = [];
            let payloadConfigs: Configuration[] = action.payload.configs ? action.payload.configs : [];
            for (let newConfig of payloadConfigs) {
                const configIndex = workspace.configs.findIndex((x) => x.name === newConfig.name);
                if (configIndex < 0) {
                    newConfigs.push(newConfig);
                } else {
                    newConfigs.push(workspace.configs[configIndex])
                }
            }
            const updatedWorkspace = Object.assign({}, workspace, {
                ...workspace,
                configs: newConfigs
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    updatedWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
    }
    return state;
};

const controlReducer = (state: ControlState = initialControlState, action) => {
    switch (action.type) {
        case actions.UPDATE_CONFIG_SELECTION:
            return Object.assign({}, state, {
                selectedConfiguration: action.payload
            });
        case actions.SELECT_SOURCE_FILE:
            return Object.assign({}, state, {
                selectedSourceFile: action.payload
            });
        case actions.SELECT_SOURCE_FILE_DIRECTORY:
            return Object.assign({}, state, {
                currentSourceFileDirectory: action.payload
            });
        case actions.SELECT_CURRENT_CONFIG:
            return Object.assign({}, state, {
                currentConfiguration: action.payload,
                selectedConfiguration: action.payload
            });
        case actions.UPDATE_MAIN_TAB:
            return Object.assign({}, state, {
                currentMainTabPanel: action.payload
            });
        case actions.UPDATE_CONFIGURATION_TAB:
            return Object.assign({}, state, {
                currentConfigurationTabPanel: action.payload
            });
        case actions.UPDATE_CONFIG_EDITOR_MODE:
            return Object.assign({}, state, {
                codeEditorActive: action.payload
            });
        case actions.ADD_CONFIG_NAME:
            return Object.assign({}, state, {
                selectedConfiguration: action.payload.newConfigurationName
            });
        case actions.UPDATE_CONFIG_NAME:
            return Object.assign({}, state, {
                selectedConfiguration: action.payload.newConfigurationName,
                currentConfiguration: action.payload.currentConfiguration
            });
        case actions.DELETE_CONFIG_NAME:
            return Object.assign({}, state, {
                selectedConfiguration: null
            });
        case actions.SET_PROCESS_NAME:
            return Object.assign({}, state, {
                processName: action.payload
            });
        case actions.ADD_NEW_PROCESS: {
            return Object.assign({}, state, {
                processName: ""
            });
        }
        case actions.UPDATE_SOURCE_FILE_LIST: {
            return Object.assign({}, state, {
                sourceFiles: action.payload
            })
        }
        case actions.UPDATE_CURRENT_WORKSPACE: {
            return Object.assign({}, state, {
                currentWorkspace: action.payload.name,
                currentSourceFileDirectory: action.payload.sourceFileDirectory,
                selectedSourceFile: null,
                globalAttributes: []
            });
        }
        case actions.REMOVE_SOURCE_FILE: {
            return Object.assign({}, state, {
                selectedSourceFile: null
            })
        }
        case actions.UPDATE_CURRENT_GLOBAL_ATTRIBUTES: {
            return Object.assign({}, state, {
                globalAttributes: action.payload
            })
        }
    }
    return state;
};

const sessionReducer = (state: Object = {}, action) => {
    return state;
};

const communicationReducer = (state: CommunicationState = {webAPIStatus: null, tasks: {}}, action) => {
    switch (action.type) {
        case actions.SET_WEBAPI_STATUS: {
            return Object.assign({}, state, {
                webAPIStatus: action.payload.webAPIStatus
            });
        }
        case actions.SET_TASK_STATE:
            const newTasks = Object.assign({}, state.tasks, {
                ...state.tasks,
            });
            newTasks[action.payload.jobId] = action.payload.taskState;
            return Object.assign({}, state, {
                tasks: newTasks
            });
    }
    return state;
};

//noinspection JSUnusedLocalSymbols
const locationReducer = (state: Object = {}, action) => {
    return state;
};

export const reducers = combineReducers<State>({
    data: dataReducer,
    control: controlReducer,
    session: sessionReducer,
    communication: communicationReducer,
    location: locationReducer,
});
