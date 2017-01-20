import {createSelector} from 'reselect'
import {State, GlobalMetadata} from "./state";

const getSourceFiles = (state: State) => state.data.sourceFiles;
const getSelectedSourceFile = (state: State) => state.control.selectedSourceFile;

export const getSelectedGlobalMetadata = createSelector(
    getSourceFiles,
    getSelectedSourceFile,
    (getSourceFiles, getSelectedSourceFile): GlobalMetadata[] => {
        return getSelectedSourceFile != null ? getSourceFiles[getSelectedSourceFile].globalMetadata : [];
    }
);
