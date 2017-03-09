import {
    ProcessConfigurations,
    SourceFile,
    ProcessingItem,
    State,
    TaskState,
    Workspace,
    GlobalAttribute,
    Configuration
} from "./state";
import * as moment from "moment";
import * as path from "path";
import {JobStatusEnum, JobProgress, JobFailure, JobPromise, JobProgressHandler} from "./webapi/Job";
import {WorkspaceAPI} from "./webapi/apis/WorkspaceAPI";
import {InputsAPI} from "./webapi/apis/InputsAPI";
import {getSourceFiles} from "../common/sourceFileUtils";
import {ConfigAPI} from "./webapi/apis/ConfigAPI";

export const UPDATE_CONFIG_SELECTION = 'UPDATE_CONFIG_SELECTION';
export const SELECT_CURRENT_CONFIG = 'SELECT_CURRENT_CONFIG';
export const SELECT_SOURCE_FILE = 'SELECT_SOURCE_FILE';
export const SELECT_SOURCE_FILE_DIRECTORY = 'SELECT_SOURCE_FILE_DIRECTORY';
export const UPDATE_SOURCE_FILE_LIST = 'UPDATE_SOURCE_FILE_LIST';
export const ADD_CONFIG_NAME = 'ADD_CONFIG_NAME';
export const UPDATE_CONFIG_NAME = 'UPDATE_CONFIG_NAME';
export const DELETE_CONFIG_NAME = 'DELETE_CONFIG_NAME';
export const UPDATE_MAIN_TAB = 'UPDATE_MAIN_TAB';
export const UPDATE_CONFIGURATION_TAB = 'UPDATE_CONFIGURATION_TAB';
export const UPDATE_CONFIG_EDITOR_MODE = 'UPDATE_CONFIG_EDITOR_MODE';
export const SAVE_CONFIGURATION = 'SAVE_CONFIGURATION';
export const SET_PROCESS_NAME = 'SET_PROCESS_NAME';
export const ADD_NEW_PROCESS = 'ADD_NEW_PROCESS';
export const SET_TEST_VAR = 'SET_TEST_VAR';
export const APPLY_INITIAL_STATE = 'APPLY_INITIAL_STATE';
export const SET_WEBAPI_STATUS = 'SET_WEBAPI_STATUS';
export const SET_TASK_STATE = 'SET_TASK_STATE';
export const APPLY_INITIAL_SOURCE_FILE_DIRECTORY = 'APPLY_INITIAL_SOURCE_FILE_DIRECTORY';

const CANCELLED_CODE = 999;

export function updateConfigSelection(selectedConfigName: string) {
    return {type: UPDATE_CONFIG_SELECTION, payload: selectedConfigName};
}

export function selectCurrentConfig(currentConfigName: string) {
    return {type: SELECT_CURRENT_CONFIG, payload: currentConfigName};
}

export function selectSourceFile(fileIndex: number) {
    return {type: SELECT_SOURCE_FILE, payload: fileIndex};
}

export function selectSourceFileDirectory(fileDirectory: string) {
    return {type: SELECT_SOURCE_FILE_DIRECTORY, payload: fileDirectory};
}

export function updateSourceFileList(sourceFiles: SourceFile[]) {
    return {type: UPDATE_SOURCE_FILE_LIST, payload: sourceFiles};
}

export function addConfigName(newConfigurationName: string, baseConfigurationName: string) {
    const currentTime = moment().format("DD/MM/YY, hh:mm:ss");
    return {
        type: ADD_CONFIG_NAME, payload: {
            newConfigurationName: newConfigurationName,
            baseConfigurationName: baseConfigurationName,
            currentTime: currentTime
        }
    };
}

export function updateConfigName(oldConfigurationName: string, newConfigurationName: string, oldCurrentConfiguration: string) {
    const currentTime = moment().format("DD/MM/YY, hh:mm:ss");
    const currentConfiguration = oldCurrentConfiguration == oldConfigurationName ? newConfigurationName : oldCurrentConfiguration;
    return {
        type: UPDATE_CONFIG_NAME, payload: {
            oldConfigurationName: oldConfigurationName,
            newConfigurationName: newConfigurationName,
            currentTime: currentTime,
            currentConfiguration: currentConfiguration
        }
    }
}

export function deleteConfigName(configName: string) {
    return {type: DELETE_CONFIG_NAME, payload: configName};
}

export function updateMainTab(newTabId: number) {
    return {type: UPDATE_MAIN_TAB, payload: newTabId};
}

export function updateConfigurationTab(newTabId: number) {
    return {type: UPDATE_CONFIGURATION_TAB, payload: newTabId};
}

export function updateConfigEditorMode(codeEditorActive: boolean) {
    return {type: UPDATE_CONFIG_EDITOR_MODE, payload: codeEditorActive};
}

export function saveConfiguration(activeConfiguration: string,
                                  chd: ProcessConfigurations,
                                  cnf: ProcessConfigurations,
                                  cst: ProcessConfigurations) {
    const currentTime = moment().format("DD/MM/YY, hh:mm:ss");
    return {
        type: SAVE_CONFIGURATION,
        payload: {
            activeConfiguration: activeConfiguration,
            chd: chd,
            cnf: cnf,
            cst: cst,
            currentTime: currentTime
        }
    };
}

export function setProcessName(processName: string) {
    return {type: SET_PROCESS_NAME, payload: processName};
}

export function addNewProcess(processingItem: ProcessingItem) {
    return {type: ADD_NEW_PROCESS, payload: processingItem};
}

export function setTaskState(jobId: number, taskState: TaskState) {
    return {type: SET_TASK_STATE, payload: {jobId, taskState}};
}

function jobSubmitted(jobId: number, title: string) {
    return setTaskState(jobId, {status: JobStatusEnum.SUBMITTED, title: title});
}

function jobProgress(progress: JobProgress) {
    return setTaskState(progress.id, {status: JobStatusEnum.IN_PROGRESS, progress});
}

function jobDone(jobId: number) {
    return setTaskState(jobId, {status: JobStatusEnum.DONE});
}

function jobFailed(jobId: number, failure: JobFailure) {
    console.error(failure);
    return setTaskState(jobId, {
        status: failure.code === CANCELLED_CODE ? JobStatusEnum.CANCELLED : JobStatusEnum.FAILED,
        failure
    });
}

export type JobPromiseFactory<T> = (jobProgressHandler: JobProgressHandler) => JobPromise<T>;
export type JobPromiseAction<T> = (jobResult: T) => void;

/**
 * Call some (remote) API asynchronously.
 *
 * @param dispatch Redux' dispatch() function.
 * @param title A human-readable title for the job that is being created
 * @param call The API call which must produce a JobPromise
 * @param action The action to be performed when the call succeeds.
 */
export function callAPI<T>(dispatch,
                           title: string,
                           call: JobPromiseFactory<T>,
                           action?: JobPromiseAction<T>): void {
    const onProgress = (progress: JobProgress) => {
        dispatch(jobProgress(progress));
    };

    const jobPromise = call(onProgress);
    dispatch(jobSubmitted(jobPromise.getJobId(), title));

    const onDone = (jobResult: T) => {
        dispatch(jobDone(jobPromise.getJobId()));
        if (action) {
            action(jobResult);
        }
    };
    const onFailure = jobFailure => {
        dispatch(jobFailed(jobPromise.getJobId(), jobFailure));
    };

    jobPromise.then(onDone, onFailure);
}

export function applyInitialState(initialState: Object) {
    return {type: APPLY_INITIAL_STATE, payload: initialState};
}

export function setWebAPIStatus(webAPIClient, webAPIStatus: 'connecting'|'open'|'error'|'closed') {
    return {type: SET_WEBAPI_STATUS, payload: {webAPIClient, webAPIStatus}};
}

// ======================== Workspace related actions via WebAPI =============================================

export const ADD_WORKSPACE = "ADD_WORKSPACE";

function workspaceAPI(state: State): WorkspaceAPI {
    return new WorkspaceAPI(state.data.appConfig.webAPIClient)
}

function addWorkSpace(newWorkspace: Workspace) {
    return {type: ADD_WORKSPACE, payload: newWorkspace};
}

export function newWorkspace(newWorkspaceName: string) {
    return (dispatch, getState) => {
        function call() {
            return workspaceAPI(getState()).newWorkspace(newWorkspaceName);
        }

        function action(workspace: Workspace) {
            dispatch(addWorkSpace(workspace));
        }

        callAPI(dispatch, "Add new workspace ".concat(newWorkspaceName), call, action);
    }
}

export const UPDATE_WORKSPACES = "UPDATE_WORKSPACES";

function updateWorkSpaces(workspaces: Workspace[]) {
    return {type: UPDATE_WORKSPACES, payload: workspaces};
}

export function getAllWorkspaces() {
    return (dispatch, getState) => {
        function call() {
            return workspaceAPI(getState()).getAllWorkspaces();
        }

        function action(workspaces: Workspace[]) {
            dispatch(updateWorkSpaces(workspaces));
        }

        callAPI(dispatch, "Get all workspace names", call, action);
    }
}

export const UPDATE_CURRENT_WORKSPACE = "UPDATE_CURRENT_WORKSPACE";

function updateCurrentWorkspace(current_workspace: Workspace) {
    const newSourceFileDirectory = path.join(current_workspace.directory, "inputs");
    return {
        type: UPDATE_CURRENT_WORKSPACE, payload: {
            name: current_workspace.name,
            sourceFileDirectory: newSourceFileDirectory
        }
    };
}

export const UPDATE_WORKSPACE_SOURCE_FILES = "UPDATE_WORKSPACE_SOURCE_FILES";

function updateWorkspaceSourceFile(workspace: Workspace, source_files: SourceFile[]) {
    return {
        type: UPDATE_WORKSPACE_SOURCE_FILES, payload: {
            workspace: workspace,
            sourceFiles: source_files
        }
    };
}

export function getCurrentWorkspace() {
    return (dispatch, getState) => {
        function call() {
            return workspaceAPI(getState()).getCurrentWorkspace();
        }

        function action(current_workspace: Workspace) {
            dispatch(updateCurrentWorkspace(current_workspace));
            let sourceFileDirectory = getState().control.currentSourceFileDirectory;
            let validSourceFiles: SourceFile[] = getSourceFiles(sourceFileDirectory);
            dispatch(updateWorkspaceSourceFile(current_workspace, validSourceFiles));
            dispatch(updateSourceFileList(validSourceFiles));
        }

        callAPI(dispatch, "Get current workspace name", call, action);
    }
}

export function setCurrentWorkspace(newWorkspaceName: string) {
    return (dispatch, getState) => {
        function call() {
            return workspaceAPI(getState()).setCurrentWorkspace(newWorkspaceName);
        }

        function action(new_workspace: Workspace) {
            dispatch(updateCurrentWorkspace(new_workspace));
            let sourceFileDirectory = getState().control.currentSourceFileDirectory;
            let validSourceFiles: SourceFile[] = getSourceFiles(sourceFileDirectory);
            dispatch(updateWorkspaceSourceFile(new_workspace, validSourceFiles));
            dispatch(selectSourceFile(null));
            dispatch(updateSourceFileList(validSourceFiles));
        }

        callAPI(dispatch, "Set current workspace to ".concat(newWorkspaceName), call, action);
    }
}

export const RENAME_WORKSPACE = "RENAME_WORKSPACE";

function updateWorkspaceNameList(oldWorkspaceName: string, newWorkspaceName: string) {
    return {
        type: RENAME_WORKSPACE, payload: {
            oldWorkspaceName: oldWorkspaceName,
            newWorkspaceName: newWorkspaceName
        }
    };
}

export function renameWorkspace(oldWorkspaceName: string, newWorkspaceName: string) {
    return (dispatch, getState) => {
        function call() {
            return workspaceAPI(getState()).renameWorkspace(oldWorkspaceName, newWorkspaceName);
        }

        function action(new_workspace: Workspace) {
            dispatch(updateWorkspaceNameList(oldWorkspaceName, newWorkspaceName));
            if (getState().control.currentWorkspace == oldWorkspaceName) {
                dispatch(updateCurrentWorkspace(new_workspace))
            }
        }

        callAPI(dispatch, "Rename workspace ".concat(oldWorkspaceName).concat(" to ").concat(newWorkspaceName), call, action);
    }
}

export function copyWorkspace(oldWorkspaceName: string, newWorkspaceName: string) {
    return (dispatch, getState) => {
        function call(onProgress) {
            return workspaceAPI(getState()).copyWorkspace(oldWorkspaceName, newWorkspaceName, onProgress);
        }

        function action(new_workspace: Workspace) {
            dispatch(addWorkSpace(new_workspace));
        }

        callAPI(dispatch, "Copy workspace ".concat(oldWorkspaceName).concat(" to ").concat(newWorkspaceName), call, action);
    }
}

export const REMOVE_WORKSPACE = "REMOVE_WORKSPACE";

function removeWorkspace(workspaceName: string) {
    return {
        type: REMOVE_WORKSPACE, payload: workspaceName
    };
}

export function deleteWorkspace(workspaceName: string) {
    return (dispatch, getState) => {
        function call() {
            return workspaceAPI(getState()).deleteWorkspace(workspaceName);
        }

        function action() {
            dispatch(removeWorkspace(workspaceName));
            if (getState().control.currentWorkspace == workspaceName) {
                if (getState().data.workspaceNames.length > 0) {
                    dispatch(updateCurrentWorkspace(getState().data.workspaceNames[0]))
                } else {
                    //TODO (hans-permana, 20170302): handle deletion of last workspace properly
                    dispatch(updateCurrentWorkspace({
                        name: "default",
                        directory: "no-dir"
                    }))
                }
            }
        }

        callAPI(dispatch, "Delete workspace ".concat(workspaceName), call, action);
    }
}

// ======================== Workspace related actions via WebAPI =============================================


// ======================== Input dataset related actions via WebAPI =============================================

function inputsAPI(state: State): InputsAPI {
    return new InputsAPI(state.data.appConfig.webAPIClient)
}

export const ADD_SOURCE_FILE = 'ADD_SOURCE_FILE';

export function addSourceFile(workspaceName: string, sourceFile: SourceFile[]) {
    return {
        type: ADD_SOURCE_FILE, payload: {
            workspaceName: workspaceName,
            sourceFile: sourceFile
        }
    };
}

export function addInputFiles(workspaceName: string, inputFilePaths: string[], inputFiles: SourceFile[]) {
    return (dispatch, getState) => {
        function call() {
            return inputsAPI(getState()).addInputFiles(workspaceName, inputFilePaths);
        }

        function action() {
            dispatch(addSourceFile(workspaceName, inputFiles));
        }

        callAPI(dispatch, "Add ".concat(inputFilePaths.length.toString()).concat(" input file(s) to workspace ").concat(workspaceName), call, action);
    }
}

export const REMOVE_SOURCE_FILE = 'REMOVE_SOURCE_FILE';

export function removeSourceFile(workspaceName: string, sourceFileName: string) {
    return {
        type: REMOVE_SOURCE_FILE, payload: {
            workspaceName: workspaceName,
            sourceFileName: sourceFileName
        }
    };
}

export function removeInputFiles(workspaceName: string, sourceFileNames: string[]) {
    return (dispatch, getState) => {
        function call() {
            return inputsAPI(getState()).removeInputFiles(workspaceName, sourceFileNames);
        }

        function action() {
            for (let sourceFileName of sourceFileNames) {
                dispatch(removeSourceFile(workspaceName, sourceFileName));
            }
            const currentWorkspaceIndex = getState().data.workspaces.findIndex((x) => x.name === workspaceName);
            dispatch(updateSourceFileList(getState().data.workspaces[currentWorkspaceIndex].inputs));
        }

        callAPI(dispatch, "Remove ".concat(sourceFileNames.length.toString()).concat(" input file(s) from workspace ").concat(workspaceName), call, action);
    }
}

export const UPDATE_CURRENT_GLOBAL_ATTRIBUTES = 'UPDATE_CURRENT_GLOBAL_ATTRIBUTES';

export function updateCurrentGlobalAttributes(globalAttributes: GlobalAttribute[]) {
    return {type: UPDATE_CURRENT_GLOBAL_ATTRIBUTES, payload: globalAttributes};
}

export function getGlobalAttributes(inputFilePath: string) {
    return (dispatch, getState) => {
        function call() {
            return inputsAPI(getState()).getGlobalAttributes(inputFilePath);
        }

        function action(globalAttributes: GlobalAttribute[]) {
            dispatch(updateCurrentGlobalAttributes(globalAttributes))
        }

        callAPI(dispatch, "Get global attributes of ".concat(inputFilePath), call, action);
    }
}


// ======================== Input dataset related actions via WebAPI =============================================


// ======================== Configuration related actions via WebAPI =============================================

function configAPI(state: State): ConfigAPI {
    return new ConfigAPI(state.data.appConfig.webAPIClient)
}

export const UPDATE_CONFIGS = "UPDATE_CONFIGS";

function updateConfigs(workspaceName: string, configs: Configuration[]) {
    return {
        type: UPDATE_CONFIGS, payload: {
            workspaceName: workspaceName,
            configs: configs
        }
    };
}

export function getAllConfigs() {
    return (dispatch, getState) => {
        const workspaceName = getState().control.currentWorkspace;

        function call() {
            return configAPI(getState()).getAllConfigs(workspaceName);
        }

        function action(configs: Configuration[]) {
            dispatch(updateConfigs(workspaceName, configs));
        }

        callAPI(dispatch, "Get all configuration names", call, action);
    }
}


// ======================== Configuration related actions via WebAPI =============================================
