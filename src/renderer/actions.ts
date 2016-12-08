export const UPDATE_PANEL_TITLE = 'UPDATE_PANEL_TITLE';

export function updatePanelTitle(panelTitle: string) {
    return {type: UPDATE_PANEL_TITLE, payload: panelTitle};
}

