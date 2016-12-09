export const UPDATE_PANEL_TITLE = 'UPDATE_PANEL_TITLE';
export const UPDATE_CONFIG_SELECTION = 'UPDATE_CONFIG_SELECTION';

export function updatePanelTitle(panelTitle: string) {
    return {type: UPDATE_PANEL_TITLE, payload: panelTitle};
}

export function updateConfigSelection(newConfigName: string) {
    return {type: UPDATE_CONFIG_SELECTION, payload: newConfigName};
}

