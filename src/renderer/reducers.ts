import {ControlState, State, DataState, Configuration, ProcessConfigurations} from "./state";
import * as actions from "./actions";
import {combineReducers} from "redux";
import {
    initialControlState,
    initialDataState,
    defaultChdConfigurations,
    defaultCnfConfigurations,
    defaultCstConfigurations
} from "./initialStates";

function getLastId(configurations: Configuration[]): string {
    let maxId = 0;
    for (let i in configurations) {
        if (Number(configurations[i].id) > maxId) {
            maxId = Number(configurations[i].id);
        }
    }
    maxId++;
    return maxId.toString(10);
}

function getSelectedConfigurations(baseConfigurationName: string, configurations: Configuration[]): {chd: ProcessConfigurations, cnf: ProcessConfigurations, cst: ProcessConfigurations} {
    for (let i in configurations) {
        if (configurations[i].name == baseConfigurationName) {
            return {
                chd: configurations[i].chd,
                cnf: configurations[i].cnf,
                cst: configurations[i].cst
            }
        }
    }
    return {
        chd: defaultChdConfigurations,
        cnf: defaultCnfConfigurations,
        cst: defaultCstConfigurations
    }

}

const dataReducer = (state: DataState = initialDataState, action) => {

    switch (action.type) {
        case actions.ADD_CONFIG_NAME: {
            const configs = getSelectedConfigurations(action.payload.baseConfigurationName, state.configurations);
            const lastId = getLastId(state.configurations);
            return Object.assign({}, state, {
                configurations: [
                    ...state.configurations,
                    {
                        id: lastId,
                        name: action.payload.newConfigurationName,
                        lastUpdated: action.payload.currentTime,
                        chd: configs.chd,
                        cnf: configs.cnf,
                        cst: configs.cst
                    }
                ]
            });
        }
        case actions.UPDATE_CONFIG_NAME: {
            const index = state.configurations.findIndex((x) => x.name === action.payload.oldConfigurationName);
            const updatedConfigurations = Object.assign({}, state.configurations[index], {
                name: action.payload.newConfigurationName,
                lastUpdated: action.payload.currentTime
            });
            return Object.assign({}, state, {
                ...state,
                configurations: [
                    ...state.configurations.slice(0, index),
                    updatedConfigurations,
                    ...state.configurations.slice(index + 1),
                ],
            });
        }
        case actions.DELETE_CONFIG_NAME: {
            const configName = action.payload;
            const index = state.configurations.findIndex((x) => x.name === configName);
            return Object.assign({}, state, {
                configurations: [
                    ...state.configurations.slice(0, index),
                    ...state.configurations.slice(index + 1)
                ]
            });
        }
        case actions.SAVE_CONFIGURATION: {
            const configName = action.payload.activeConfiguration;
            const index = state.configurations.findIndex((x) => x.name === configName);
            const oldConfiguration = state.configurations[index];
            const newConfiguration = Object.assign({}, oldConfiguration, {
                chd: action.payload.chd,
                cnf: action.payload.cnf,
                cst: action.payload.cst,
                name: configName,
                lastUpdated: action.payload.currentTime
            });
            return Object.assign({}, state, {
                configurations: [
                    ...state.configurations.slice(0, index),
                    newConfiguration,
                    ...state.configurations.slice(index + 1)
                ]
            });
        }
        case actions.UPDATE_SOURCE_FILE_LIST: {
            return Object.assign({}, state, {
                sourceFiles: action.payload
            })
        }
    }
    return state;
};

const controlReducer = (state: ControlState = initialControlState, action) => {
    switch (action.type) {
        case actions.UPDATE_CONFIG_SELECTION:
            return Object.assign({}, state, {
                selectedConfiguration: action.payload
            });
        case actions.SELECT_SOURCE_FILE:
            return Object.assign({}, state, {
                selectedSourceFile: action.payload
            });
        case actions.SELECT_SOURCE_FILE_DIRECTORY:
            return Object.assign({}, state, {
                currentSourceFileDirectory: action.payload
            });
        case actions.SELECT_CURRENT_CONFIG:
            return Object.assign({}, state, {
                currentConfiguration: action.payload,
                selectedConfiguration: action.payload
            });
        case actions.UPDATE_MAIN_TAB:
            return Object.assign({}, state, {
                currentMainTabPanel: action.payload
            });
        case actions.UPDATE_CONFIGURATION_TAB:
            return Object.assign({}, state, {
                currentConfigurationTabPanel: action.payload
            });
        case actions.UPDATE_CONFIG_EDITOR_MODE:
            return Object.assign({}, state, {
                codeEditorActive: action.payload
            });
        case actions.ADD_CONFIG_NAME:
            return Object.assign({}, state, {
                selectedConfiguration: action.payload.newConfigurationName
            });
        case actions.UPDATE_CONFIG_NAME:
            return Object.assign({}, state, {
                selectedConfiguration: action.payload.newConfigurationName,
                currentConfiguration: action.payload.currentConfiguration
            });
        case actions.DELETE_CONFIG_NAME:
            return Object.assign({}, state, {
                selectedConfiguration: null
            })
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
