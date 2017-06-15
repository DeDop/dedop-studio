import {createSelector} from "reselect";
import * as path from "path";
import {Configuration, ProcessConfigurations, ProcessingItem, SourceFile, State, Workspace} from "./state";

const getSelectedConfigurationName = (state: State) => state.control.selectedConfigurationName;
const getCurrentConfigurationName = (state: State) => state.control.currentConfigurationName;
const getWorkspaces = (state: State) => state.data.workspaces;
const getProcesses = (state: State) => state.data.processes;
const getCurrentWorkspaceName = (state: State) => state.control.currentWorkspaceName;
const getSelectedSourceFileName = (state: State) => state.control.selectedSourceFileName;
export const getCesiumPoints = (state: State) => state.cesium.cesiumPoints;

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

export const getCurrentWorkspaceProcesses = createSelector(
    getCurrentWorkspace,
    getProcesses,
    (getCurrentWorkspace, getProcesses): ProcessingItem[] => {
        let processes: ProcessingItem[] = [];
        for (let process of getProcesses) {
            if (process.workspace == getCurrentWorkspace.name) {
                processes.push(process);
            }
        }
        return processes ? processes : [];
    }
);

export const getCurrentConfiguration = createSelector(
    getAllConfigurations,
    getCurrentConfigurationName,
    (getAllConfigurations, getCurrentConfigurationName): Configuration => {
        const configIndex = getAllConfigurations.findIndex((x) => x.name == getCurrentConfigurationName);
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
    getCurrentWorkspace,
    (getCurrentWorkspace): string[] => {
        let outputNames: string[] = [];
        for (let config of getCurrentWorkspace.configs) {
            if (config.outputs) {
                outputNames = outputNames.concat(config.outputs);
            }
        }
        return outputNames;
    }
);

export const getWorkspaceDirectory = createSelector(
    getCurrentWorkspace,
    (getCurrentWorkspace): string => {
        if (getCurrentWorkspace) {
            return path.join(getCurrentWorkspace.directory);
        }
        return "";
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
