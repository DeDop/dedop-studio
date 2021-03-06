import {
    CesiumPoint,
    Configuration,
    GlobalAttribute,
    OutputFile,
    ProcessConfigurations,
    ProcessingItem,
    SourceFile,
    State,
    TaskState,
    Workspace
} from './state';
import * as moment from 'moment';
import * as path from 'path';
import {JobFailure, JobProgress, JobProgressHandler, JobPromise, JobStatusEnum} from './webapi/Job';
import {WorkspaceAPI} from './webapi/apis/WorkspaceAPI';
import {InputsAPI} from './webapi/apis/InputsAPI';
import {constructInputDirectory, constructOutputDirectory, getSourceFiles} from '../common/fileUtils';
import {ConfigAPI} from './webapi/apis/ConfigAPI';
import {ProcessAPI} from './webapi/apis/ProcessAPI';
import {OutputAPI} from './webapi/apis/OutputAPI';

export const SELECT_SOURCE_FILE = 'SELECT_SOURCE_FILE';
export const SELECT_SOURCE_FILE_DIRECTORY = 'SELECT_SOURCE_FILE_DIRECTORY';
export const UPDATE_SOURCE_FILE_LIST = 'UPDATE_SOURCE_FILE_LIST';
export const UPDATE_MAIN_TAB = 'UPDATE_MAIN_TAB';
export const UPDATE_CONFIGURATION_TAB = 'UPDATE_CONFIGURATION_TAB';
export const UPDATE_CONFIG_EDITOR_MODE = 'UPDATE_CONFIG_EDITOR_MODE';
export const UPDATE_SELECTED_SOURCE_TYPE = 'UPDATE_SELECTED_SOURCE_TYPE';
export const UPDATE_SELECTED_OUTPUT_DIR_TYPE = 'UPDATE_SELECTED_OUTPUT_DIR_TYPE';
export const UPDATE_CURRENT_OUTPUT_DIRECTORY = 'UPDATE_CURRENT_OUTPUT_DIRECTORY';
export const UPDATE_SELECTED_PROCESSES = 'UPDATE_SELECTED_PROCESSES';
export const UPDATE_UNSAVED_CONFIG_STATUS = 'UPDATE_UNSAVED_CONFIG_STATUS';
export const SET_PROCESS_NAME = 'SET_PROCESS_NAME';
export const SET_TEST_VAR = 'SET_TEST_VAR';
export const APPLY_INITIAL_STATE = 'APPLY_INITIAL_STATE';
export const SET_WEBAPI_STATUS = 'SET_WEBAPI_STATUS';
export const SET_TASK_STATE = 'SET_TASK_STATE';
export const APPLY_INITIAL_SOURCE_FILE_DIRECTORY = 'APPLY_INITIAL_SOURCE_FILE_DIRECTORY';
export const UPDATE_CHD_TEMP = 'UPDATE_CHD_TEMP';
export const UPDATE_CNF_TEMP = 'UPDATE_CNF_TEMP';
export const UPDATE_CST_TEMP = 'UPDATE_CST_TEMP';

const CANCELLED_CODE = 999;
const DEFAULT_WORKSPACE_NAME = 'default';
const DEFAULT_CONFIG_NAME = 'default';
const DEFAULT_CONFIG_TYPE = 'sentinel3';

export function selectSourceFile(fileName: string) {
    return {type: SELECT_SOURCE_FILE, payload: fileName};
}

export function selectSourceFileDirectory(fileDirectory: string) {
    return {type: SELECT_SOURCE_FILE_DIRECTORY, payload: fileDirectory};
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

export function updateSelectedSourceType(sourceType: string) {
    return {type: UPDATE_SELECTED_SOURCE_TYPE, payload: sourceType};
}

export function updateSelectedOutputDirectoryType(outputDirType: string) {
    return {type: UPDATE_SELECTED_OUTPUT_DIR_TYPE, payload: outputDirType};
}

export function updateCurrentOutputDirectory(outputDirectory: string) {
    return {type: UPDATE_CURRENT_OUTPUT_DIRECTORY, payload: outputDirectory};
}

export function updateSelectedProcesses(processId: number[]) {
    return {type: UPDATE_SELECTED_PROCESSES, payload: processId};
}

export function updateChdTemp(newChdTemp: ProcessConfigurations){
    return {type: UPDATE_CHD_TEMP, payload: newChdTemp};
}

export function updateCnfTemp(newCnfTemp: ProcessConfigurations){
    return {type: UPDATE_CNF_TEMP, payload: newCnfTemp};
}

export function updateCstTemp(newCstTemp: ProcessConfigurations){
    return {type: UPDATE_CST_TEMP, payload: newCstTemp};
}

export function updateUnsavedConfigStatus(status: boolean) {
    return {type: UPDATE_UNSAVED_CONFIG_STATUS, payload: status};
}

// ======================== Dialog related actions =============================================

export const UPDATE_WEBAPI_DIALOG = 'UPDATE_WEBAPI_DIALOG';

export function updateWebapiDialog(openDialog: boolean) {
    return {type: UPDATE_WEBAPI_DIALOG, payload: openDialog};
}

// ======================== Dialog related actions =============================================

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
    const status = failure.code === CANCELLED_CODE ? JobStatusEnum.CANCELLED : JobStatusEnum.FAILED;
    if (status === JobStatusEnum.FAILED) {
        console.error(failure);
    }
    showMessageBox({
        type: 'error',
        title: 'DeDop - Error',
        message: failure.message,
        detail: `An error (code ${failure.code}) occurred while executing a background process:\n\n${failure.data}`,
        buttons: [],
    }, MESSAGE_BOX_NO_REPLY);
    return setTaskState(jobId, {status, failure});
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
 * @param failureAction The action to be performed when the call fails.
 */
export function callAPI<T>(dispatch,
                           title: string,
                           call: JobPromiseFactory<T>,
                           action?: JobPromiseAction<T>,
                           failureAction?: JobPromiseAction<JobFailure>): void {
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
        if (failureAction) {
            failureAction(jobFailure);
        }
    };

    jobPromise.then(onDone, onFailure);
}

export function applyInitialState(initialState: Object) {
    return {type: APPLY_INITIAL_STATE, payload: initialState};
}

export function setWebAPIStatus(webAPIClient, webAPIStatus: 'connecting' | 'open' | 'error' | 'closed') {
    return {type: SET_WEBAPI_STATUS, payload: {webAPIClient, webAPIStatus}};
}

// ======================== Workspace related actions via WebAPI =============================================

export const ADD_WORKSPACE = 'ADD_WORKSPACE';

function workspaceAPI(state: State): WorkspaceAPI {
    return new WorkspaceAPI(state.data.appConfig.webAPIClient)
}

function addWorkSpace(newWorkspace: Workspace) {
    return {type: ADD_WORKSPACE, payload: newWorkspace};
}

export function addNewWorkspace(newWorkspaceName: string) {
    return (dispatch, getState) => {
        function call() {
            return workspaceAPI(getState()).newWorkspace(newWorkspaceName);
        }

        function action(workspace: Workspace) {
            dispatch(addWorkSpace(workspace));
        }

        callAPI(dispatch, 'Add new workspace '.concat(newWorkspaceName), call, action);
    }
}

export const UPDATE_WORKSPACES = 'UPDATE_WORKSPACES';

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

        callAPI(dispatch, 'Get all workspace names', call, action);
    }
}

export const UPDATE_CURRENT_WORKSPACE = 'UPDATE_CURRENT_WORKSPACE';

function updateCurrentWorkspace(current_workspace: Workspace) {
    const newSourceFileDirectory = path.join(current_workspace.directory, 'inputs');
    return {
        type: UPDATE_CURRENT_WORKSPACE, payload: {
            name: current_workspace.name,
            sourceFileDirectory: newSourceFileDirectory
        }
    };
}

export const UPDATE_WORKSPACE_SOURCE_FILES = 'UPDATE_WORKSPACE_SOURCE_FILES';

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
            if (current_workspace.name == null) {
                dispatch(addNewWorkspace(DEFAULT_WORKSPACE_NAME));
                let newWorkspace: Workspace = Object.assign({}, current_workspace, {
                    name: DEFAULT_WORKSPACE_NAME
                });

                dispatch(updateCurrentWorkspace(newWorkspace));
                dispatch(addNewConfig(DEFAULT_CONFIG_NAME, DEFAULT_CONFIG_TYPE));
                dispatch(setCurrentWorkspace(DEFAULT_WORKSPACE_NAME));
                dispatch(setCurrentConfig(DEFAULT_CONFIG_NAME));
            } else {
                dispatch(updateCurrentWorkspace(current_workspace));
                let sourceFileDirectory = getState().control.currentSourceFileDirectory;
                let validSourceFiles: SourceFile[] = getSourceFiles(sourceFileDirectory);
                dispatch(updateWorkspaceSourceFile(current_workspace, validSourceFiles));
                dispatch(getAllConfigs());
                dispatch(getCurrentConfig());
                dispatch(getNotebookFileNames());
            }
        }

        callAPI(dispatch, 'Get current workspace name', call, action);
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
            dispatch(getAllConfigs());
            dispatch(getCurrentConfig());
            dispatch(getNotebookFileNames());
            dispatch(updateSelectedOutputs([]));
            const outputDirectory = determineCurrentOutputDirectory(getState, newWorkspaceName, getState().control.currentConfigurationName);
            dispatch(updateCurrentOutputDirectory(outputDirectory));
        }

        callAPI(dispatch, 'Set current workspace to '.concat(newWorkspaceName), call, action);
    }
}

export const RENAME_WORKSPACE = 'RENAME_WORKSPACE';

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
            if (getState().control.currentWorkspaceName == oldWorkspaceName) {
                dispatch(setCurrentWorkspace(new_workspace.name))
            }
        }

        callAPI(dispatch, 'Rename workspace '.concat(oldWorkspaceName).concat(' to ').concat(newWorkspaceName), call, action);
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

        callAPI(dispatch, 'Copy workspace '.concat(oldWorkspaceName).concat(' to ').concat(newWorkspaceName), call, action);
    }
}

export const REMOVE_WORKSPACE = 'REMOVE_WORKSPACE';

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
            if (getState().control.currentWorkspaceName == workspaceName) {
                if (getState().data.workspaceNames.length > 0) {
                    dispatch(updateCurrentWorkspace(getState().data.workspaceNames[0]))
                } else {
                    //TODO (hans-permana, 20170302): handle deletion of last workspace properly
                    dispatch(updateCurrentWorkspace({
                        name: DEFAULT_WORKSPACE_NAME,
                        directory: 'no-dir'
                    }))
                }
            }
        }

        callAPI(dispatch, 'Delete workspace '.concat(workspaceName), call, action);
    }
}

// ======================== Workspace related actions via WebAPI =============================================


// ======================== Input dataset related actions via WebAPI =============================================

function inputsAPI(state: State): InputsAPI {
    return new InputsAPI(state.data.appConfig.webAPIClient)
}

export function addInputFiles(newInputFiles: SourceFile[]) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;
        let inputFilePaths: string[] = [];
        for (let inputFile of newInputFiles) {
            inputFilePaths.push(inputFile.path)
        }

        function call() {
            return inputsAPI(getState()).addInputFiles(currentWorkspaceName, inputFilePaths);
        }

        function action() {
            const currentWorkspaceInputDirectory: string = constructCurrentInputDirectory(getState, currentWorkspaceName);
            let currentSourceFiles: SourceFile[] = getSourceFiles(currentWorkspaceInputDirectory);
            const currentWorkspaceIndex = getCurrentWorkspaceIndex(getState(), currentWorkspaceName);
            dispatch(updateWorkspaceSourceFile(getState().data.workspaces[currentWorkspaceIndex], currentSourceFiles));
        }

        callAPI(dispatch, 'Add '.concat(inputFilePaths.length.toString()).concat(' input file(s) to workspace ').concat(currentWorkspaceName), call, action);
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
        }

        callAPI(dispatch, 'Remove '.concat(sourceFileNames.length.toString()).concat(' input file(s) from workspace ').concat(workspaceName), call, action);
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

        callAPI(dispatch, 'Get global attributes of '.concat(inputFilePath), call, action);
    }
}

export const UPDATE_CURRENT_CESIUM_POINTS = 'UPDATE_CURRENT_CESIUM_POINTS';

export function updateCurrentCesiumPoints(cesiumPoints: CesiumPoint[]) {
    return {type: UPDATE_CURRENT_CESIUM_POINTS, payload: cesiumPoints};
}

export function getLatLon(inputFilePath: string) {
    return (dispatch, getState) => {
        function call() {
            return inputsAPI(getState()).getMaxMinCoordinates(inputFilePath);
        }

        function action(cesiumPoints: CesiumPoint[]) {
            dispatch(updateCurrentCesiumPoints(cesiumPoints))
        }

        callAPI(dispatch, 'Get lat lon of '.concat(inputFilePath), call, action);
    }
}


// ======================== Input dataset related actions via WebAPI =============================================


// ======================== Configuration related actions via WebAPI =============================================

function configAPI(state: State): ConfigAPI {
    return new ConfigAPI(state.data.appConfig.webAPIClient)
}

export const UPDATE_CONFIG_NAMES = 'UPDATE_CONFIG_NAMES';

function updateConfigs(workspaceName: string, configs: Configuration[]) {
    return {
        type: UPDATE_CONFIG_NAMES, payload: {
            workspaceName: workspaceName,
            configs: configs
        }
    };
}

export function getAllConfigs() {
    return (dispatch, getState) => {
        const workspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).getConfigNames(workspaceName);
        }

        function action(configs: Configuration[]) {
            dispatch(updateConfigs(workspaceName, configs));
            if (configs && configs.length) {
                for (let config of configs) {
                    dispatch(getOutputFileNames(workspaceName, config.name))
                }
            }
        }

        callAPI(dispatch, 'Get all configuration names', call, action);
    }
}

export const ADD_CONFIG_NAME = 'ADD_CONFIG_NAME';

export function addConfigName(workspaceName: string, newConfigurationName: string) {
    const currentTime = moment().format('DD/MM/YY, HH:mm:ss');
    return {
        type: ADD_CONFIG_NAME, payload: {
            workspaceName: workspaceName,
            newConfigurationName: newConfigurationName,
            currentTime: currentTime
        }
    };
}

export function addNewConfig(configName: string, configType: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).addNewConfig(currentWorkspaceName, configName, configType);
        }

        function action() {
            dispatch(addConfigName(currentWorkspaceName, configName));
            dispatch(getConfigurations(configName));
        }

        callAPI(dispatch, 'Add new configuration '.concat(configName).concat(' to workspace ').concat(currentWorkspaceName), call, action);
    }
}

export function deleteConfigName(workspaceName: string, configName: string) {
    return {
        type: DELETE_CONFIG_NAME, payload: {
            workspaceName: workspaceName,
            configName: configName
        }
    };
}

export const DELETE_CONFIG_NAME = 'DELETE_CONFIG_NAME';

export function removeConfig(configName: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).deleteConfig(currentWorkspaceName, configName);
        }

        function action() {
            dispatch(deleteConfigName(currentWorkspaceName, configName));
        }

        callAPI(dispatch, 'Remove configuration '.concat(configName).concat(' from workspace ').concat(currentWorkspaceName), call, action);
    }
}

export function copyConfig(configName: string, newConfigName: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).copyConfig(currentWorkspaceName, configName, newConfigName);
        }

        function action() {
            dispatch(addConfigName(currentWorkspaceName, newConfigName));
            dispatch(getConfigurations(newConfigName));
        }

        callAPI(dispatch, 'Copy configuration \''.concat(configName).concat('\' to \'').concat(newConfigName).concat('\''), call, action);
    }
}

export const UPDATE_CONFIG_NAME = 'UPDATE_CONFIG_NAME';

export function updateConfigName(workspaceName: string, configName: string, newConfigName: string) {
    const currentTime = moment().format('DD/MM/YY, HH:mm:ss');
    return {
        type: UPDATE_CONFIG_NAME, payload: {
            workspaceName: workspaceName,
            configName: configName,
            newConfigName: newConfigName,
            currentTime: currentTime
        }
    }
}

export const UPDATE_CONFIG_SELECTION = 'UPDATE_CONFIG_SELECTION';

export function updateConfigSelection(selectedConfigName: string) {
    return {type: UPDATE_CONFIG_SELECTION, payload: selectedConfigName};
}

export function renameConfig(configName: string, newConfigName: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).renameConfig(currentWorkspaceName, configName, newConfigName);
        }

        function action() {
            dispatch(updateConfigName(currentWorkspaceName, configName, newConfigName));
            dispatch(updateConfigSelection(newConfigName));
        }

        callAPI(dispatch, 'Copy configuration \''.concat(configName).concat('\' to \'').concat(newConfigName).concat('\''), call, action);
    }
}

export const UPDATE_CURRENT_CONFIG = 'UPDATE_CURRENT_CONFIG';

export function updateCurrentConfig(currentConfigName: string) {
    return {type: UPDATE_CURRENT_CONFIG, payload: currentConfigName};
}

export function getCurrentConfig() {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;
        const currentWorkspaceIndex = getCurrentWorkspaceIndex(getState(), currentWorkspaceName);
        const currentWorkspace = getState().data.workspaces[currentWorkspaceIndex];

        function call() {
            return configAPI(getState()).getCurrentConfig(currentWorkspaceName);
        }

        function action(current_config: string) {
            dispatch(updateCurrentConfig(current_config));
            if (current_config) {
                dispatch(getConfigurations(current_config));
                const outputDirectory = determineCurrentOutputDirectory(getState, currentWorkspaceName, current_config);
                dispatch(updateCurrentOutputDirectory(outputDirectory));
            } else if (!current_config && currentWorkspace.configs.length == 0) {
                dispatch(addNewConfig(DEFAULT_CONFIG_NAME, DEFAULT_CONFIG_TYPE));
                dispatch(setCurrentConfig(DEFAULT_CONFIG_NAME));
            }
        }

        callAPI(dispatch, 'Get current configuration name', call, action);
    }
}

export function setCurrentConfig(configName: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).setCurrentConfig(currentWorkspaceName, configName);
        }

        function action() {
            dispatch(updateCurrentConfig(configName));
            dispatch(updateUnsavedConfigStatus(false));
            const outputDirectory = determineCurrentOutputDirectory(getState, currentWorkspaceName, configName);
            dispatch(updateCurrentOutputDirectory(outputDirectory));
            dispatch(updateSelectedOutputs([]));
        }

        callAPI(dispatch, 'Set current configuration name to '.concat(configName), call, action);
    }
}

export const UPDATE_CONFIG = 'UPDATE_CONFIG';

export function updateConfiguration(workspaceName: string, configuration: Configuration) {
    const currentTime = moment().format('DD/MM/YY, HH:mm:ss');
    return {
        type: UPDATE_CONFIG, payload: {
            workspaceName: workspaceName,
            configuration: configuration,
            currentTime: currentTime
        }
    };
}

export function getConfigurations(configName: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).getConfigs(currentWorkspaceName, configName);
        }

        function action(configuration: Configuration) {
            dispatch(updateConfiguration(currentWorkspaceName, configuration));
        }

        callAPI(dispatch, 'Set configuration values of \''.concat(configName).concat('\''), call, action);
    }
}

export function saveConfiguration(currentConfiguration: string,
                                  chd: ProcessConfigurations,
                                  cnf: ProcessConfigurations,
                                  cst: ProcessConfigurations) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).saveConfigs(currentWorkspaceName, currentConfiguration, {
                chd: chd,
                cnf: cnf,
                cst: cst
            });
        }

        function action() {
            const updatedConfiguration = {
                name: currentConfiguration,
                chd: chd,
                cnf: cnf,
                cst: cst
            };
            dispatch(updateConfiguration(currentWorkspaceName, updatedConfiguration));
        }

        callAPI(dispatch, 'Save configuration values.', call, action);
    }
}

export const UPDATE_DEFAULT_CONFIG_VERSIONS = 'UPDATE_DEFAULT_CONFIG_VERSIONS';

export function udpateDefaultConfigurationVersions(chdVersion: number, cnfVersion: number, cstVersion: number) {
    return {
        type: UPDATE_DEFAULT_CONFIG_VERSIONS, payload: {
            chdVersion: chdVersion,
            cnfVersion: cnfVersion,
            cstVersion: cstVersion
        }
    };
}

export function getDefaultConfigurationVersions() {
    return (dispatch, getState) => {
        function call() {
            return configAPI(getState()).getDefaultConfigVersions();
        }

        function action(versions: { chdVersion: number, cnfVersion: number, cstVersion: number }) {
            dispatch(udpateDefaultConfigurationVersions(versions.chdVersion, versions.cnfVersion, versions.cstVersion));
        }

        callAPI(dispatch, 'Get default configuration versions.', call, action);
    }
}

export function upgradeConfigurations(configName: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).upgradeConfigs(currentWorkspaceName, configName);
        }

        function action(configuration: Configuration) {
            dispatch(updateConfiguration(currentWorkspaceName, configuration));
        }

        callAPI(dispatch, 'Upgrade configurations of \''.concat(configName).concat('\''), call, action);
    }
}

// ======================== Configuration related actions via WebAPI =============================================


// ======================== Process related actions via WebAPI =============================================

function processAPI(state: State): ProcessAPI {
    return new ProcessAPI(state.data.appConfig.webAPIClient)
}

export const ADD_NEW_PROCESS = 'ADD_NEW_PROCESS';

export function addNewProcess(processingItem: ProcessingItem) {
    return {type: ADD_NEW_PROCESS, payload: processingItem};
}

export const MARK_PROCESS_AS_FINISHED = 'MARK_PROCESS_AS_FINISHED';

export function markProcessAsFinished(processId: number, processingDuration: string, status: string, message: string) {
    return {
        type: MARK_PROCESS_AS_FINISHED, payload: {
            processId: processId,
            processingDuration: processingDuration,
            status: status,
            message: message
        }
    };
}

// export const RUN_PROCESS_QUEUE = 'RUN_PROCESS_QUEUE';
//
// export function addProcessToQueue(outputPath: string, l1aFilePath: string) {
//     return {
//         queue: RUN_PROCESS_QUEUE,
//         callback: (next, dispatch, getState) => {
//             console.log("before running process");
//             runProcess(outputPath, l1aFilePath);
//             console.log("after running process");
//             next();
//         }
//     }
// }

export function runProcess(outputPath: string, l1aFilePath: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;
        const currentConfigName = getState().control.selectedConfigurationName;
        let taskId: number = 0;
        let processId: number = 0;
        let jobStatus: string;
        let startTime: number;

        function call(onProgress) {
            const job = processAPI(getState()).process(
                currentConfigName,
                currentWorkspaceName,
                currentConfigName,
                outputPath,
                l1aFilePath,
                onProgress);
            taskId = job.getJobId();
            processId = getNewProcessId(getState().data.processes);
            jobStatus = job.getJob().getStatus();
            startTime = moment.now();
            const startTimeFormatted = moment(startTime).format('DD/MM/YY, HH:mm:ss');
            const newProcess: ProcessingItem = {
                id: processId,
                taskId: taskId,
                workspace: currentWorkspaceName,
                configuration: currentConfigName,
                startedTime: startTimeFormatted,
                status: jobStatus,
                processingDuration: ''
            };
            dispatch(addNewProcess(newProcess));
            return job;
        }

        function action() {
            const processingDuration = moment.duration(moment().diff(startTime)).humanize();
            dispatch(markProcessAsFinished(processId, processingDuration.toString(),
                getState().communication.tasks[taskId].status,
                'successful'
            ));
            dispatch(getOutputFileNames(currentWorkspaceName, currentConfigName));
        }

        function failureAction(jobFailure: JobFailure) {
            const processingDuration = moment.duration(moment().diff(startTime)).humanize();
            dispatch(markProcessAsFinished(processId, processingDuration.toString(),
                getState().communication.tasks[taskId].status,
                jobFailure.message))
        }

        callAPI(dispatch, 'Create a new process \''.concat(currentConfigName).concat('\''), call, action, failureAction);
    }
}

function getNewProcessId(processes: ProcessingItem[]): number {
    let lastProcessId = 0;
    for (let process of processes) {
        if (process.id > lastProcessId) {
            lastProcessId = process.id;
        }
    }
    return ++lastProcessId;
}

export const REMOVE_PROCESS = 'REMOVE_PROCESS';

export function removeProcess(processId: number) {
    return {
        type: REMOVE_PROCESS, payload: processId
    };
}

// ======================== Process related actions via WebAPI =============================================


// ======================== Output related actions via WebAPI =============================================

function outputAPI(state: State): OutputAPI {
    return new OutputAPI(state.data.appConfig.webAPIClient);
}

export const UPDATE_OUTPUTS = 'UPDATE_OUTPUTS';

export function updateOutputs(workspaceName: string, configName: string, outputs: string[]) {
    return {
        type: UPDATE_OUTPUTS,
        payload: {
            workspaceName: workspaceName,
            configName: configName,
            outputs: outputs
        }
    };
}

export function getOutputFileNames(currentWorkspaceName: string, currentConfigName: string) {
    return (dispatch, getState) => {
        function call() {
            return outputAPI(getState()).get_output_names(currentWorkspaceName, currentConfigName);
        }

        function action(outputNames: string[]) {
            dispatch(updateOutputs(currentWorkspaceName, currentConfigName, outputNames));
        }

        callAPI(dispatch, 'Get output file names for configuration \''.concat(currentConfigName).concat('\''), call, action);
    }
}

export const DELETE_ALL_OUTPUT_FILES = 'DELETE_ALL_OUTPUT_FILES';

export function deleteAllOutputFiles(workspaceName: string, configName: string) {
    return {
        type: DELETE_ALL_OUTPUT_FILES,
        payload: {
            workspaceName: workspaceName,
            configName: configName
        }
    }
}

export function removeOutputFiles(workspaceName: string, configName: string) {
    return (dispatch, getState) => {
        function call() {
            return outputAPI(getState()).remove_output_files(workspaceName, configName);
        }

        function action() {
            dispatch(deleteAllOutputFiles(workspaceName, configName));
        }

        callAPI(dispatch, 'Remove output files of workspace \''.concat(workspaceName).concat('\' and configuration \'').concat(configName).concat('\'.'), call, action);
    }
}

export const UPDATE_SELECTED_OUTPUTS = 'UPDATE_SELECTED_OUTPUTS';

export function updateSelectedOutputs(selectedOutputs: OutputFile[]) {
    return {type: UPDATE_SELECTED_OUTPUTS, payload: selectedOutputs};
}

export function generateAndRunInspectOutput(outputFilePath: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return outputAPI(getState()).inspect_output(currentWorkspaceName, outputFilePath);
        }

        function action() {
            dispatch(getNotebookFileNames());
        }

        callAPI(dispatch, 'Inspecting output file \''.concat(outputFilePath).concat('\''), call, action);
    }
}

export function generateAndRunCompareOutputs(outputFile1Path: string, outputFile2Path: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return outputAPI(getState()).compare_outputs(currentWorkspaceName, outputFile1Path, outputFile2Path);
        }

        function action() {
            dispatch(getNotebookFileNames());
        }

        callAPI(dispatch, 'Comparing output files \''.concat(outputFile1Path).concat('\' and \'').concat(outputFile2Path).concat('\''), call, action);
    }
}

export const UPDATE_NOTEBOOK_FILE_NAMES = 'UPDATE_NOTEBOOK_FILE_NAMES';

export function updateNotebookFileNames(workspaceName: string, notebookFileNames: string[]) {
    return {
        type: UPDATE_NOTEBOOK_FILE_NAMES, payload: {
            workspaceName: workspaceName,
            notebookFileNames: notebookFileNames
        }
    };
}

export function getNotebookFileNames() {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return outputAPI(getState()).get_notebook_file_names(currentWorkspaceName);
        }

        function action(notebookFileNames: string[]) {
            dispatch(updateNotebookFileNames(currentWorkspaceName, notebookFileNames));
        }

        callAPI(dispatch, 'Get notebook files of workspace \''.concat(currentWorkspaceName).concat('\''), call, action);
    }
}

export const UPDATE_SELECTED_NOTEBOOK = 'UPDATE_SELECTED_NOTEBOOK';

export function updateSelectedNotebook(selectedNotebookName: string) {
    return {
        type: UPDATE_SELECTED_NOTEBOOK, payload: selectedNotebookName
    };
}

export function launchNotebook(notebookName: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return outputAPI(getState()).launch_notebook(currentWorkspaceName, notebookName);
        }

        callAPI(dispatch, 'Launch notebook file \''.concat(notebookName).concat('\''), call);
    }
}

// ======================== Output related actions via WebAPI =============================================


/**
 * Update frontend preferences (but not backend configuration).
 *
 * @param callback an optional function which is called with the selected button index
 * @returns the selected button index or null, if no button was selected or the callback function is defined
 */
export function sendPreferencesToMain(callback?: (error: any) => void) {
    return (dispatch, getState) => {
        const electron = require('electron');
        if (!electron || !electron.ipcRenderer) {
            console.warn('sendPreferencesToMain() cannot be executed, electron/electron.ipcRenderer not available from renderer process');
            return;
        }
        let finishedProcesses: ProcessingItem[] = [];
        if (getState().data.processes) {
            for (let process of getState().data.processes) {
                if (process.status != JobStatusEnum.SUBMITTED) {
                    process.taskId = 0;
                    finishedProcesses.push(process);
                }
            }
        }
        const preferences = {
            processes: finishedProcesses,
            isCnfEditable: getState().control.isCnfEditable,
            isChdEditable: getState().control.isChdEditable,
            isCstEditable: getState().control.isCstEditable,
            isOfflineMode: getState().control.isOfflineMode
        };
        const actionName = 'set-preferences';
        electron.ipcRenderer.send(actionName, preferences);
        if (callback) {
            electron.ipcRenderer.once(actionName + '-reply', (event, error: any) => {
                callback(error);
            });
        }
    };
}

function getCurrentWorkspaceIndex(state: State, workspaceName: string) {
    return state.data.workspaces.findIndex((x) => x.name === workspaceName);
}

function constructCurrentInputDirectory(getState, currentWorkspaceName: string) {
    const currentWorkspaceIndex = getCurrentWorkspaceIndex(getState(), currentWorkspaceName);
    return constructInputDirectory(getState().data.workspaces[currentWorkspaceIndex].directory);
}

function determineCurrentOutputDirectory(getState, currentWorkspaceName: string, configName: string) {
    const currentWorkspaceIndex = getCurrentWorkspaceIndex(getState(), currentWorkspaceName);
    if (getState().control.selectedOutputDirectoryType == 'default') {
        return constructOutputDirectory(getState().data.workspaces[currentWorkspaceIndex].directory, configName);
    } else {
        return getState().control.currentOutputDirectory;
    }
}

/**
 * See dialog.showMessageBox() in https://github.com/electron/electron/blob/master/docs/api/dialog.md
 */
export interface MessageBoxOptions {
    /**
     * Can be "none", "info", "error", "question" or "warning". On Windows, "question" displays the same icon as "info", unless you set an icon using the "icon" option.
     */
    type?: string;

    /**
     * Array of texts for buttons. On Windows, an empty array will result in one button labeled "OK".
     */
    buttons?: string[];

    /**
     * Title of the message box, some platforms will not show it.
     */
    title?: string;

    /**
     * Content of the message box.
     */
    message: string;

    /**
     * Extra information of the message.
     */
    detail?: string;

    /**
     *  NativeImage: https://github.com/electron/electron/blob/master/docs/api/native-image.md
     */
    icon?: any;

    /**
     * Index of the button in the buttons array which will be selected by default when the message box opens.
     */
    defaultId?: number;

    /**
     * The value will be returned when user cancels the dialog instead of clicking the buttons of the dialog.
     * By default it is the index of the buttons that have "cancel" or "no" as label, or 0 if there is no such buttons.
     * On macOS and Windows the index of the "Cancel" button will always be used as cancelId even if it is specified.
     */
    cancelId?: number;

    /**
     * On Windows Electron will try to figure out which one of the buttons are common buttons (like "Cancel" or "Yes"),
     * and show the others as command links in the dialog. This can make the dialog appear in the style of modern
     * Windows apps. If you don't like this behavior, you can set noLink to true.
     */
    noLink?: boolean;
}

export const MESSAGE_BOX_NO_REPLY = () => {
};

/**
 * Shows a native message box.
 *
 * @param messageBoxOptions the message dialog options, see https://github.com/electron/electron/blob/master/docs/api/dialog.md
 * @param callback an optional function which is called with the selected button index
 * @returns the selected button index or null, if no button was selected or the callback function is defined
 */
export function showMessageBox(messageBoxOptions: MessageBoxOptions, callback?: (index: number) => void): number
    | null {
    const electron = require('electron');
    if (!electron) {
        console.warn('showMessageBox() cannot be executed, electron not available from renderer process');
        return;
    }
    const actionName = 'show-message-box';
    if (!messageBoxOptions.buttons) {
        messageBoxOptions = Object.assign({}, messageBoxOptions, {buttons: ['OK']});
    }
    if (callback) {
        electron.ipcRenderer.send(actionName, messageBoxOptions, false);
        electron.ipcRenderer.once(actionName + '-reply', (event, index: number) => {
            callback(index);
        });
        return null;
    } else {
        return electron.ipcRenderer.sendSync(actionName, messageBoxOptions, true);
    }
}
