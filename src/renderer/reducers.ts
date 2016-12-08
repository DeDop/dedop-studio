import {ControlState, State} from './state';
import * as actions from './actions';
import {combineReducers} from 'redux';

const dataReducer = (state: Object = {}, action) => {
    return state;
};

const initialControlState: ControlState = {
    mainPanelTitle: "test"
};

const controlReducer = (state: ControlState = initialControlState, action) => {
    switch (action.type) {
        case actions.UPDATE_PANEL_TITLE: {
            const title = action.payload;
            return Object.assign({}, state, {
                mainPanelTitle: title
            });
        }
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
