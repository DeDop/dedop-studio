import {
    ProcessConfigurations,
    SourceFile,
    ProcessingItem,
    State,
    TaskState,
    Workspace,
    GlobalAttribute,
    Configuration,
    CesiumPoint
} from "./state";
import * as moment from "moment";
import * as path from "path";
import {JobStatusEnum, JobProgress, JobFailure, JobPromise, JobProgressHandler} from "./webapi/Job";
import {WorkspaceAPI} from "./webapi/apis/WorkspaceAPI";
import {InputsAPI} from "./webapi/apis/InputsAPI";
import {getSourceFiles} from "../common/sourceFileUtils";
import {ConfigAPI} from "./webapi/apis/ConfigAPI";
import {ProcessAPI} from "./webapi/apis/ProcessAPI";
import {OutputAPI} from "./webapi/apis/OutputAPI";

export const SELECT_SOURCE_FILE = 'SELECT_SOURCE_FILE';
export const SELECT_SOURCE_FILE_DIRECTORY = 'SELECT_SOURCE_FILE_DIRECTORY';
export const UPDATE_SOURCE_FILE_LIST = 'UPDATE_SOURCE_FILE_LIST';
export const UPDATE_MAIN_TAB = 'UPDATE_MAIN_TAB';
export const UPDATE_CONFIGURATION_TAB = 'UPDATE_CONFIGURATION_TAB';
export const UPDATE_OUTPUT_FILES_TAB = 'UPDATE_OUTPUT_FILES_TAB';
export const UPDATE_CONFIG_EDITOR_MODE = 'UPDATE_CONFIG_EDITOR_MODE';
export const UPDATE_SELECTED_SOURCE_TYPE = 'UPDATE_SELECTED_SOURCE_TYPE';
export const UPDATE_CURRENT_OUTPUT_DIRECTORY = 'UPDATE_CURRENT_OUTPUT_DIRECTORY';
export const SET_PROCESS_NAME = 'SET_PROCESS_NAME';
export const SET_TEST_VAR = 'SET_TEST_VAR';
export const APPLY_INITIAL_STATE = 'APPLY_INITIAL_STATE';
export const SET_WEBAPI_STATUS = 'SET_WEBAPI_STATUS';
export const SET_TASK_STATE = 'SET_TASK_STATE';
export const APPLY_INITIAL_SOURCE_FILE_DIRECTORY = 'APPLY_INITIAL_SOURCE_FILE_DIRECTORY';

const CANCELLED_CODE = 999;

export function selectSourceFile(fileName: string) {
    return {type: SELECT_SOURCE_FILE, payload: fileName};
}

export function selectSourceFileDirectory(fileDirectory: string) {
    return {type: SELECT_SOURCE_FILE_DIRECTORY, payload: fileDirectory};
}

export function updateSourceFileList(sourceFiles: SourceFile[]) {
    return {type: UPDATE_SOURCE_FILE_LIST, payload: sourceFiles};
}

export function updateMainTab(newTabId: number) {
    return {type: UPDATE_MAIN_TAB, payload: newTabId};
}

export function updateConfigurationTab(newTabId: number) {
    return {type: UPDATE_CONFIGURATION_TAB, payload: newTabId};
}

export function updateOutputFilesTab(newTabId: number) {
    return {type: UPDATE_OUTPUT_FILES_TAB, payload: newTabId};
}

export function updateConfigEditorMode(codeEditorActive: boolean) {
    return {type: UPDATE_CONFIG_EDITOR_MODE, payload: codeEditorActive};
}

export function updateSelectedSourceType(sourceType: string) {
    return {type: UPDATE_SELECTED_SOURCE_TYPE, payload: sourceType};
}

export function updateCurrentOutputDirectory(outputDirectory: string) {
    return {type: UPDATE_CURRENT_OUTPUT_DIRECTORY, payload: outputDirectory};
}

export function setProcessName(processName: string) {
    return {type: SET_PROCESS_NAME, payload: processName};
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
            dispatch(getAllConfigs());
            dispatch(getCurrentConfig());
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
            dispatch(getAllConfigs());
            dispatch(getCurrentConfig());
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
            if (getState().control.currentWorkspaceName == oldWorkspaceName) {
                dispatch(setCurrentWorkspace(new_workspace.name))
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
            if (getState().control.currentWorkspaceName == workspaceName) {
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
            const currentWorkspaceIndex = getCurrentWorkspaceIndex(getState(), workspaceName);
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

export const UPDATE_CURRENT_CESIUM_POINTS = 'UPDATE_CURRENT_CESIUM_POINTS';

export function updateCurrentCesiumPoints(cesiumPoints: CesiumPoint[]) {
    return {type: UPDATE_CURRENT_CESIUM_POINTS, payload: cesiumPoints};
}

export function getLatLon(inputFilePath: string) {
    return (dispatch, getState) => {
        function call() {
            return inputsAPI(getState()).getLatLon(inputFilePath);
        }

        function action(cesiumPoints: CesiumPoint[]) {
            dispatch(updateCurrentCesiumPoints(cesiumPoints))
        }

        callAPI(dispatch, "Get global attributes of ".concat(inputFilePath), call, action);
    }
}


// ======================== Input dataset related actions via WebAPI =============================================


// ======================== Configuration related actions via WebAPI =============================================

function configAPI(state: State): ConfigAPI {
    return new ConfigAPI(state.data.appConfig.webAPIClient)
}

export const UPDATE_CONFIG_NAMES = "UPDATE_CONFIG_NAMES";

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
        }

        callAPI(dispatch, "Get all configuration names", call, action);
    }
}

export const ADD_CONFIG_NAME = 'ADD_CONFIG_NAME';

export function addConfigName(workspaceName: string, newConfigurationName: string) {
    const currentTime = moment().format("DD/MM/YY, HH:mm:ss");
    return {
        type: ADD_CONFIG_NAME, payload: {
            workspaceName: workspaceName,
            newConfigurationName: newConfigurationName,
            currentTime: currentTime
        }
    };
}

export function addNewConfig(configName: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).addNewConfig(currentWorkspaceName, configName);
        }

        function action() {
            dispatch(addConfigName(currentWorkspaceName, configName));
            dispatch(getConfigurations(configName));
        }

        callAPI(dispatch, "Add new configuration ".concat(configName).concat(" to workspace ").concat(currentWorkspaceName), call, action);
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

        callAPI(dispatch, "Remove configuration ".concat(configName).concat(" from workspace ").concat(currentWorkspaceName), call, action);
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

        callAPI(dispatch, "Copy configuration '".concat(configName).concat("' to '").concat(newConfigName).concat("'"), call, action);
    }
}

export const UPDATE_CONFIG_NAME = 'UPDATE_CONFIG_NAME';

export function updateConfigName(workspaceName: string, configName: string, newConfigName: string) {
    const currentTime = moment().format("DD/MM/YY, HH:mm:ss");
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

        callAPI(dispatch, "Copy configuration '".concat(configName).concat("' to '").concat(newConfigName).concat("'"), call, action);
    }
}

export const UPDATE_CURRENT_CONFIG = 'UPDATE_CURRENT_CONFIG';

export function updateCurrentConfig(currentConfigName: string) {
    return {type: UPDATE_CURRENT_CONFIG, payload: currentConfigName};
}

export function getCurrentConfig() {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return configAPI(getState()).getCurrentConfig(currentWorkspaceName);
        }

        function action(current_config: string) {
            dispatch(updateCurrentConfig(current_config));
            if (current_config) {
                dispatch(getConfigurations(current_config));
                const currentOutputDirectory = constructCurrentOutputDirectory(getState, currentWorkspaceName, current_config);
                dispatch(updateCurrentOutputDirectory(currentOutputDirectory));
            }
        }

        callAPI(dispatch, "Get current configuration name", call, action);
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
            const currentOutputDirectory = constructCurrentOutputDirectory(getState, currentWorkspaceName, configName);
            dispatch(updateCurrentOutputDirectory(currentOutputDirectory));
            dispatch(getOutputFileNames());
        }

        callAPI(dispatch, "Set current configuration name to ".concat(configName), call, action);
    }
}

export const UPDATE_CONFIG = 'UPDATE_CONFIG';

export function updateConfiguration(workspaceName: string, configuration: Configuration) {
    const currentTime = moment().format("DD/MM/YY, HH:mm:ss");
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

        callAPI(dispatch, "Set configuration values of '".concat(configName).concat("'"), call, action);
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

        callAPI(dispatch, "Save configuration values.", call, action);
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

        function action(versions: {chdVersion: number, cnfVersion: number, cstVersion: number}) {
            dispatch(udpateDefaultConfigurationVersions(versions.chdVersion, versions.cnfVersion, versions.cstVersion));
        }

        callAPI(dispatch, "Get default configuration versions.", call, action);
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

        callAPI(dispatch, "Upgrade configurations of '".concat(configName).concat("'"), call, action);
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

export function markProcessAsFinished(jobId: number, processingDuration: string, status: string, message: string) {
    return {
        type: MARK_PROCESS_AS_FINISHED, payload: {
            jobId: jobId,
            processingDuration: processingDuration,
            status: status,
            message: message
        }
    };
}

export function runProcess(processName: string, outputPath: string, l1aFilePath: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;
        const currentConfigName = getState().control.selectedConfigurationName;
        let jobId: number = 0;
        let jobStatus: string;
        let startTime: number;

        function call(onProgress) {
            const job = processAPI(getState()).process(
                processName,
                currentWorkspaceName,
                currentConfigName,
                outputPath,
                l1aFilePath,
                onProgress);
            jobId = job.getJobId();
            jobStatus = job.getJob().getStatus();
            startTime = moment.now();
            const startTimeFormatted = moment(startTime).format("DD/MM/YY, HH:mm:ss");
            const newProcess: ProcessingItem = {
                id: jobId,
                name: processName,
                workspace: currentWorkspaceName,
                configuration: currentConfigName,
                startedTime: startTimeFormatted,
                status: jobStatus,
                processingDuration: ""
            };
            dispatch(addNewProcess(newProcess));
            return job;
        }

        function action() {
            const processingDuration = moment.duration(moment().diff(startTime)).humanize();
            dispatch(markProcessAsFinished(jobId, processingDuration.toString(),
                getState().communication.tasks[jobId].status,
                "successful"
            ))
        }

        function failureAction(jobFailure: JobFailure) {
            const processingDuration = moment.duration(moment().diff(startTime)).humanize();
            dispatch(markProcessAsFinished(jobId, processingDuration.toString(),
                getState().communication.tasks[jobId].status,
                jobFailure.message))
        }

        callAPI(dispatch, "Create a new process '".concat(processName).concat("'"), call, action, failureAction);
    }
}

// ======================== Process related actions via WebAPI =============================================


// ======================== Output related actions via WebAPI =============================================

function outputAPI(state: State): OutputAPI {
    return new OutputAPI(state.data.appConfig.webAPIClient);
}

export const UPDATE_OUTPUTS = 'UPDATE_OUTPUTS';

export function updateOutputs(workspaceName: string, configName: string, outputs: string[]) {
    return {
        type: UPDATE_OUTPUTS, payload: {
            workspaceName: workspaceName,
            configName: configName,
            outputs: outputs
        }
    };
}

export function getOutputFileNames() {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;
        const currentConfigName = getState().control.currentConfigurationName;

        function call() {
            return outputAPI(getState()).get_output_names(currentWorkspaceName, currentConfigName);
        }

        function action(outputNames: string[]) {
            dispatch(updateOutputs(currentWorkspaceName, currentConfigName, outputNames));
        }

        callAPI(dispatch, "Get output file names for configuration '".concat(currentConfigName).concat("'"), call, action);
    }
}

export const UPDATE_SELECTED_OUTPUTS = 'UPDATE_SELECTED_OUTPUTS';

export function updateSelectedOutputs(selectedOutputs: string[]) {
    return {type: UPDATE_SELECTED_OUTPUTS, payload: selectedOutputs};
}

export function inspectOutput(outputFilePath: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return outputAPI(getState()).inspect_output(currentWorkspaceName, outputFilePath);
        }

        callAPI(dispatch, "Inspecting output file '".concat(outputFilePath).concat("'"), call);
    }
}

export function compareOutputs(outputFile1Path: string, outputFile2Path: string) {
    return (dispatch, getState) => {
        const currentWorkspaceName = getState().control.currentWorkspaceName;

        function call() {
            return outputAPI(getState()).compare_outputs(currentWorkspaceName, outputFile1Path, outputFile2Path);
        }

        callAPI(dispatch, "Comparing output files '".concat(outputFile1Path).concat("' and '").concat(outputFile2Path).concat("'"), call);
    }
}

// ======================== Output related actions via WebAPI =============================================


function getCurrentWorkspaceIndex(state: State, workspaceName: string) {
    return state.data.workspaces.findIndex((x) => x.name === workspaceName);
}

function constructCurrentOutputDirectory(getState, currentWorkspaceName: string, configName: string) {
    const currentWorkspaceIndex = getCurrentWorkspaceIndex(getState(), currentWorkspaceName);
    return path.join(getState().data.workspaces[currentWorkspaceIndex].directory, "configs", configName, "outputs");
}
