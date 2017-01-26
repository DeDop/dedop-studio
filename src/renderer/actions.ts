import {ProcessConfigurations} from './state';

export const UPDATE_PANEL_TITLE = 'UPDATE_PANEL_TITLE';
export const UPDATE_CONFIG_SELECTION = 'UPDATE_CONFIG_SELECTION';
export const SELECT_CURRENT_CONFIG = 'SELECT_CURRENT_CONFIG';
export const SELECT_SOURCE_FILE = 'SELECT_SOURCE_FILE';
export const ADD_CONFIG_NAME = 'ADD_CONFIG_NAME';
export const UPDATE_CONFIG_NAME = 'UPDATE_CONFIG_NAME';
export const DELETE_CONFIG_NAME = 'DELETE_CONFIG_NAME';
export const UPDATE_MAIN_TAB = 'UPDATE_MAIN_TAB';
export const UPDATE_CONFIGURATION_TAB = 'UPDATE_CONFIGURATION_TAB';
export const UPDATE_CONFIG_EDITOR_MODE = 'UPDATE_CONFIG_EDITOR_MODE';
export const SAVE_CONFIGURATION = 'SAVE_CONFIGURATION';

export function updatePanelTitle(panelTitle: string) {
    return {type: UPDATE_PANEL_TITLE, payload: panelTitle};
}

export function updateConfigSelection(selectedConfigName: string) {
    return {type: UPDATE_CONFIG_SELECTION, payload: selectedConfigName};
}

export function selectCurrentConfig(currentConfigName: string) {
    return {type: SELECT_CURRENT_CONFIG, payload: currentConfigName};
}

export function selectSourceFile(fileName: string) {
    return {type: SELECT_SOURCE_FILE, payload: fileName};
}

export function addConfigName(newConfigurationName: string, baseConfigurationName: string) {
    return {
        type: ADD_CONFIG_NAME, payload: {
            newConfigurationName: newConfigurationName,
            baseConfigurationName: baseConfigurationName
        }
    };
}

export function updateConfigName(oldConfigurationName: string, newConfigurationName: string) {
    return {
        type: UPDATE_CONFIG_NAME, payload: {
            oldConfigurationName: oldConfigurationName,
            newConfigurationName: newConfigurationName
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
    console.log("inside action", activeConfiguration);
    return {
        type: SAVE_CONFIGURATION,
        payload: {activeConfiguration: activeConfiguration, chd: chd, cnf: cnf, cst: cst}
    };
}
