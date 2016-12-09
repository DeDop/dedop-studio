export const UPDATE_PANEL_TITLE = 'UPDATE_PANEL_TITLE';
export const UPDATE_CONFIG_SELECTION = 'UPDATE_CONFIG_SELECTION';
export const SELECT_CURRENT_CONFIG = 'SELECT_CURRENT_CONFIG';
export const UPDATE_MAIN_TAB = 'UPDATE_MAIN_TAB';

export function updatePanelTitle(panelTitle: string) {
    return {type: UPDATE_PANEL_TITLE, payload: panelTitle};
}

export function updateConfigSelection(selectedConfigName: string) {
    return {type: UPDATE_CONFIG_SELECTION, payload: selectedConfigName};
}

export function selectCurrentConfig(currentConfigName: string) {
    return {type: SELECT_CURRENT_CONFIG, payload: currentConfigName};
}

export function updateMainTab(newTabId: number) {
    return {type: UPDATE_MAIN_TAB, payload: newTabId};
}

