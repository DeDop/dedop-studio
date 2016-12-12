import {ControlState, State, DataState} from './state';
import * as actions from './actions';
import {combineReducers} from 'redux';
import {initialControlState, initialDataState} from "./initialStates";

const dataReducer = (state: DataState = initialDataState, action) => {
    switch (action.type) {
        case actions.ADD_CONFIG_NAME:
            return Object.assign({}, state, {
                configurations: [
                    ...state.configurations,
                    {
                        id: "99",
                        name: action.payload,
                        lastUpdated: "01/01/1900 00:00:00"
                    }
                ]
            });
        case actions.DELETE_CONFIG_NAME:
            const configIndexToBeDeleted = action.payload;
            return Object.assign({}, state, {
                configurations: [
                    ...state.configurations.slice(0, configIndexToBeDeleted),
                    ...state.configurations.slice(configIndexToBeDeleted + 1)
                ]
            });
    }
    return state;
};

const controlReducer = (state: ControlState = initialControlState, action) => {
    switch (action.type) {
        case actions.UPDATE_PANEL_TITLE:
            return Object.assign({}, state, {
                mainPanelTitle: action.payload
            });
        case actions.UPDATE_CONFIG_SELECTION:
            return Object.assign({}, state, {
                selectedConfiguration: action.payload
            });
        case actions.SELECT_CURRENT_CONFIG:
            return Object.assign({}, state, {
                currentConfiguration: action.payload
            });
        case actions.UPDATE_MAIN_TAB:
            return Object.assign({}, state, {
                currentMainTabPanel: action.payload
            });
        case actions.UPDATE_CONFIG_EDITOR_MODE:
            return Object.assign({}, state, {
                codeEditorActive: !action.payload
            });
    }
    return state;
};

const sessionReducer = (state: Object = {}, action) => {
    return state;
};

const communicationReducer = (state: Object = {}, action) => {
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
