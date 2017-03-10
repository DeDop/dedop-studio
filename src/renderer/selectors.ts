import {createSelector} from "reselect";
import {State, ProcessConfigurations, SourceFile, Configuration} from "./state";

const getSelectedConfiguration = (state: State) => state.control.selectedConfiguration;
const getWorkspaces = (state: State) => state.data.workspaces;
const getCurrentWorkspace = (state: State) => state.control.currentWorkspace;

export const getConfigurations = createSelector(
    getWorkspaces,
    getCurrentWorkspace,
    (getWorkspaces, getCurrentWorkspace): Configuration[] => {
        const workspaceIndex = getWorkspaces.findIndex((x) => x.name == getCurrentWorkspace);
        return workspaceIndex >= 0 ? getWorkspaces[workspaceIndex].configs : [];
    }
);

export const getSelectedChd = createSelector(
    getConfigurations,
    getSelectedConfiguration,
    (getConfigurations, getSelectedConfiguration): ProcessConfigurations => {
        const configIndex = getConfigurations.findIndex((x) => x.name === getSelectedConfiguration);
        return configIndex >= 0 ? getConfigurations[configIndex].chd : null;
    }
);

export const getSelectedCnf = createSelector(
    getConfigurations,
    getSelectedConfiguration,
    (getConfigurations, getSelectedConfiguration): ProcessConfigurations => {
        const configIndex = getConfigurations.findIndex((x) => x.name === getSelectedConfiguration);
        return configIndex >= 0 ? getConfigurations[configIndex].cnf : null;
    }
);

export const getSelectedCst = createSelector(
    getConfigurations,
    getSelectedConfiguration,
    (getConfigurations, getSelectedConfiguration): ProcessConfigurations => {
        const configIndex = getConfigurations.findIndex((x) => x.name === getSelectedConfiguration);
        return configIndex >= 0 ? getConfigurations[configIndex].cst : null;
    }
);

export const getConfigurationNames = createSelector(
    getConfigurations,
    (getConfigurations): string[] => {
        let configNames = [];
        for (let i of getConfigurations) {
            configNames.push(i.name);
        }
        return configNames;
    }
);

export const getAddedSourceFiles = createSelector(
    getWorkspaces,
    getCurrentWorkspace,
    (getWorkspaces, getCurrentWorkspace): SourceFile[] => {
        const workspaceIndex = getWorkspaces.findIndex((x) => x.name == getCurrentWorkspace);
        return workspaceIndex >= 0 ? getWorkspaces[workspaceIndex].inputs : [];
    }
);
