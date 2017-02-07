import {ProcessConfigurations, SourceFile, ProcessingItem} from "./state";
import * as moment from "moment";

export const UPDATE_CONFIG_SELECTION = 'UPDATE_CONFIG_SELECTION';
export const SELECT_CURRENT_CONFIG = 'SELECT_CURRENT_CONFIG';
export const SELECT_SOURCE_FILE = 'SELECT_SOURCE_FILE';
export const ADD_SOURCE_FILE = 'ADD_SOURCE_FILE';
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

export function updateConfigSelection(selectedConfigName: string) {
    return {type: UPDATE_CONFIG_SELECTION, payload: selectedConfigName};
}

export function selectCurrentConfig(currentConfigName: string) {
    return {type: SELECT_CURRENT_CONFIG, payload: currentConfigName};
}

export function selectSourceFile(fileIndex: number) {
    return {type: SELECT_SOURCE_FILE, payload: fileIndex};
}

export function addSourceFile(sourceFile: SourceFile) {
    return {type: ADD_SOURCE_FILE, payload: sourceFile};
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
