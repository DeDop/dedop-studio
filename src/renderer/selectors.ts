import {createSelector} from 'reselect'
import {State, GlobalMetadata, ProcessConfigurations} from "./state";

const getSourceFiles = (state: State) => state.control.sourceFiles;
const getSelectedSourceFile = (state: State) => state.control.selectedSourceFile;
const getConfigurations = (state: State) => state.data.configurations;
const getSelectedConfiguration = (state: State) => state.control.selectedConfiguration;

export const getSelectedGlobalMetadata = createSelector(
    getSourceFiles,
    getSelectedSourceFile,
    (getSourceFiles, getSelectedSourceFile): GlobalMetadata[] => {
        return getSelectedSourceFile != null ? getSourceFiles[getSelectedSourceFile].globalMetadata : [];
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
