import {createSelector} from "reselect";
import * as path from "path";
import {State, ProcessConfigurations, SourceFile, Configuration, Workspace} from "./state";

const getSelectedConfigurationName = (state: State) => state.control.selectedConfigurationName;
const getWorkspaces = (state: State) => state.data.workspaces;
const getCurrentWorkspaceName = (state: State) => state.control.currentWorkspaceName;
const getSelectedSourceFileName = (state: State) => state.control.selectedSourceFileName;

export const getCurrentWorkspace = createSelector(
    getWorkspaces,
    getCurrentWorkspaceName,
    (getWorkspaces, getCurrentWorkspaceName): Workspace => {
        const workspaceIndex = getWorkspaces.findIndex((x) => x.name == getCurrentWorkspaceName);
        return workspaceIndex >= 0 ? getWorkspaces[workspaceIndex] : null;
    }
);

export const getAllConfigurations = createSelector(
    getCurrentWorkspace,
    (getCurrentWorkspace): Configuration[] => {
        return getCurrentWorkspace ? getCurrentWorkspace.configs : [];
    }
);

export const getCurrentConfiguration = createSelector(
    getAllConfigurations,
    getSelectedConfigurationName,
    (getAllConfigurations, getSelectedConfigurationName): Configuration => {
        const configIndex = getAllConfigurations.findIndex((x) => x.name == getSelectedConfigurationName);
        return configIndex >= 0 ? getAllConfigurations[configIndex] : null;
    }
);

export const getSelectedChd = createSelector(
    getAllConfigurations,
    getSelectedConfigurationName,
    (getConfigurations, getSelectedConfigurationName): ProcessConfigurations => {
        const configIndex = getConfigurations.findIndex((x) => x.name === getSelectedConfigurationName);
        return configIndex >= 0 ? getConfigurations[configIndex].chd : null;
    }
);

export const getSelectedCnf = createSelector(
    getAllConfigurations,
    getSelectedConfigurationName,
    (getConfigurations, getSelectedConfigurationName): ProcessConfigurations => {
        const configIndex = getConfigurations.findIndex((x) => x.name === getSelectedConfigurationName);
        return configIndex >= 0 ? getConfigurations[configIndex].cnf : null;
    }
);

export const getSelectedCst = createSelector(
    getAllConfigurations,
    getSelectedConfigurationName,
    (getConfigurations, getSelectedConfigurationName): ProcessConfigurations => {
        const configIndex = getConfigurations.findIndex((x) => x.name === getSelectedConfigurationName);
        return configIndex >= 0 ? getConfigurations[configIndex].cst : null;
    }
);

export const getConfigurationNames = createSelector(
    getAllConfigurations,
    (getConfigurations): string[] => {
        let configNames = [];
        for (let i of getConfigurations) {
            configNames.push(i.name);
        }
        return configNames;
    }
);

export const getAddedSourceFiles = createSelector(
    getCurrentWorkspace,
    (getCurrentWorkspace): SourceFile[] => {
        return getCurrentWorkspace ? getCurrentWorkspace.inputs : [];
    }
);

export const getSelectedSourceFile = createSelector(
    getAddedSourceFiles,
    getSelectedSourceFileName,
    (getAddedSourceFiles, getSelectedSourceFileName): SourceFile => {
        const sourceFileIndex = getAddedSourceFiles.findIndex((x) => x.name == getSelectedSourceFileName);
        return sourceFileIndex >= 0 ? getAddedSourceFiles[sourceFileIndex] : null;
    }
);

export const getOutputNames = createSelector(
    getCurrentConfiguration,
    (getCurrentConfiguration): string[] => {
        return getCurrentConfiguration ? getCurrentConfiguration.outputs : [];
    }
);

export const getOutputDirectory = createSelector(
    getCurrentWorkspace,
    getCurrentConfiguration,
    (getCurrentWorkspace, getCurrentConfiguration): string => {
        if (getCurrentWorkspace && getCurrentConfiguration) {
            return path.join(getCurrentWorkspace.directory, "configs", getCurrentConfiguration.name, "outputs");
        }
        return "";
    }
);

export const getNotebookFileNames = createSelector(
    getCurrentWorkspace,
    (getCurrentWorkspace): string[] => {
        if (getCurrentWorkspace && getCurrentWorkspace.notebooks != null) {
            return getCurrentWorkspace.notebooks;
        }
        return [];
    }
);
