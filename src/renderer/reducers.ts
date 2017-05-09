import {ControlState, State, DataState, Configuration, CommunicationState, Workspace} from "./state";
import * as actions from "./actions";
import {combineReducers} from "redux";
import {initialControlState, initialDataState} from "./initialStates";

function getWorkspaceIndex(workspaces: Workspace[], workspaceName: string) {
    return workspaces.findIndex((x) => x.name === workspaceName);
}

function getConfigIndex(configurations: Configuration[], configName: string) {
    return configurations.findIndex((x) => x.name === configName);
}

const dataReducer = (state: DataState = initialDataState, action) => {

    switch (action.type) {
        case actions.REMOVE_SOURCE_FILE: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspaceName);
            const workspace = state.workspaces[workspaceIndex];
            const inputFileIndex = workspace.inputs.findIndex((x) => x.name === action.payload.sourceFileName);
            const updatedWorkspace = Object.assign({}, workspace, {
                inputs: [
                    ...workspace.inputs.slice(0, inputFileIndex),
                    ...workspace.inputs.slice(inputFileIndex + 1)
                ]
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    updatedWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1),
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
            const processes = action.payload.session.processes ? action.payload.session.processes : [];
            return Object.assign({}, state, {
                appConfig: action.payload.appConfig,
                processes: processes
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
                    const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload[i].name);
                    if (workspaceIndex < 0) {
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
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.oldWorkspaceName);
            const newWorkspace = {
                ...state.workspaces[workspaceIndex],
                name: action.payload.newWorkspaceName
            };
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    newWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.REMOVE_WORKSPACE: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload);
            return Object.assign({}, state, {
                workspaceNames: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.UPDATE_WORKSPACE_SOURCE_FILES: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspace.name);
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
        case actions.UPDATE_CONFIG_NAMES: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspaceName);
            const workspace = state.workspaces[workspaceIndex];
            let newConfigs: Configuration[] = [];
            let payloadConfigs: Configuration[] = action.payload.configs ? action.payload.configs : [];
            for (let newConfig of payloadConfigs) {
                const configIndex = getConfigIndex(workspace.configs, newConfig.name);
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
        case actions.ADD_CONFIG_NAME: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspaceName);
            const workspace = state.workspaces[workspaceIndex];
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
                    ...state.workspaces.slice(0, workspaceIndex),
                    updatedWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.UPDATE_CONFIG_NAME: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspaceName);
            const workspace = state.workspaces[workspaceIndex];
            const configIndex = getConfigIndex(workspace.configs, action.payload.configName);
            const updateConfig = Object.assign({}, workspace.configs[configIndex], {
                name: action.payload.newConfigName,
                lastUpdated: action.payload.currentTime
            });
            const updatedWorkspace = Object.assign({}, workspace, {
                configs: [
                    ...workspace.configs.slice(0, configIndex),
                    updateConfig,
                    ...workspace.configs.slice(configIndex + 1)
                ]
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    updatedWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.DELETE_CONFIG_NAME: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspaceName);
            const workspace = state.workspaces[workspaceIndex];
            const configIndex = getConfigIndex(workspace.configs, action.payload.configName);
            const updatedWorkspace = Object.assign({}, workspace, {
                configs: [
                    ...workspace.configs.slice(0, configIndex),
                    ...workspace.configs.slice(configIndex + 1)

                ]
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    updatedWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.UPDATE_CONFIG: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspaceName);
            const workspace = state.workspaces[workspaceIndex];
            const configIndex = getConfigIndex(workspace.configs, action.payload.configuration.name);
            const updateConfig = Object.assign({}, workspace.configs[configIndex], {
                lastUpdated: action.payload.currentTime,
                chd: action.payload.configuration.chd,
                cnf: action.payload.configuration.cnf,
                cst: action.payload.configuration.cst,
            });
            const updatedWorkspace = Object.assign({}, workspace, {
                configs: [
                    ...workspace.configs.slice(0, configIndex),
                    updateConfig,
                    ...workspace.configs.slice(configIndex + 1)
                ]
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    updatedWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.MARK_PROCESS_AS_FINISHED: {
            let processIndex = state.processes.findIndex((x) => x.id === action.payload.processId);
            const process = state.processes[processIndex];
            let updatedProcess = Object.assign({}, process, {
                status: action.payload.status,
                processingDuration: action.payload.processingDuration,
                message: action.payload.message
            });
            return Object.assign({}, state, {
                processes: [
                    ...state.processes.slice(0, processIndex),
                    updatedProcess,
                    ...state.processes.slice(processIndex + 1)
                ]
            });
        }
        case actions.UPDATE_DEFAULT_CONFIG_VERSIONS: {
            const configurationVersions = {
                configuration: {
                    chd: action.payload.chdVersion,
                    cnf: action.payload.cnfVersion,
                    cst: action.payload.cstVersion
                }
            };
            return Object.assign({}, state, {
                version: configurationVersions
            });
        }
        case actions.UPDATE_OUTPUTS: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspaceName);
            const workspace = state.workspaces[workspaceIndex];
            const configIndex = getConfigIndex(workspace.configs, action.payload.configName);
            const updatedConfig = Object.assign({}, workspace.configs[configIndex], {
                outputs: action.payload.outputs
            });
            const updatedWorkspace = Object.assign({}, workspace, {
                configs: [
                    ...workspace.configs.slice(0, configIndex),
                    updatedConfig,
                    ...workspace.configs.slice(configIndex + 1)
                ]
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    updatedWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.UPDATE_NOTEBOOK_FILE_NAMES: {
            const workspaceIndex = getWorkspaceIndex(state.workspaces, action.payload.workspaceName);
            let newWorkspace = Object.assign({}, state.workspaces[workspaceIndex], {
                notebooks: action.payload.notebookFileNames
            });
            return Object.assign({}, state, {
                workspaces: [
                    ...state.workspaces.slice(0, workspaceIndex),
                    newWorkspace,
                    ...state.workspaces.slice(workspaceIndex + 1)
                ]
            });
        }
        case actions.REMOVE_PROCESS: {
            const processIndex = state.processes.findIndex((x) => x.id === action.payload);
            return Object.assign({}, state, {
                processes: [
                    ...state.processes.slice(0, processIndex),
                    ...state.processes.slice(processIndex + 1)
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
                selectedConfigurationName: action.payload
            });
        case actions.SELECT_SOURCE_FILE:
            return Object.assign({}, state, {
                selectedSourceFileName: action.payload
            });
        case actions.SELECT_SOURCE_FILE_DIRECTORY:
            return Object.assign({}, state, {
                currentSourceFileDirectory: action.payload
            });
        case actions.UPDATE_CURRENT_CONFIG:
            return Object.assign({}, state, {
                currentConfigurationName: action.payload,
                selectedConfigurationName: action.payload
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
                selectedConfigurationName: action.payload.newConfigurationName
            });
        case actions.DELETE_CONFIG_NAME:
            return Object.assign({}, state, {
                selectedConfigurationName: null
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
                currentWorkspaceName: action.payload.name,
                currentSourceFileDirectory: action.payload.sourceFileDirectory,
                selectedSourceFileName: null,
                globalAttributes: []
            });
        }
        case actions.REMOVE_SOURCE_FILE: {
            return Object.assign({}, state, {
                selectedSourceFileName: null
            })
        }
        case actions.UPDATE_CURRENT_GLOBAL_ATTRIBUTES: {
            return Object.assign({}, state, {
                globalAttributes: action.payload
            })
        }
        case actions.UPDATE_SELECTED_SOURCE_TYPE: {
            return Object.assign({}, state, {
                selectedSourceType: action.payload
            })
        }
        case actions.UPDATE_CURRENT_OUTPUT_DIRECTORY: {
            return Object.assign({}, state, {
                currentOutputDirectory: action.payload
            })
        }
        case actions.UPDATE_SELECTED_OUTPUTS: {
            return Object.assign({}, state, {
                selectedOutputFileNames: action.payload
            })
        }
        case actions.UPDATE_CURRENT_CESIUM_POINTS: {
            return Object.assign({}, state, {
                cesiumPoints: action.payload
            })
        }
        case actions.UPDATE_SELECTED_PROCESSES: {
            return Object.assign({}, state, {
                selectedProcesses: action.payload
            })
        }
        case actions.UPDATE_SELECTED_NOTEBOOK: {
            return Object.assign({}, state, {
                selectedNotebookFileName: action.payload
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
