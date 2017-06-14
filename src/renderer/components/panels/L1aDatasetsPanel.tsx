import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {ListBox} from "../ListBox";
import {SourceFile, State} from "../../state";
import {connect, Dispatch} from "react-redux";
import {
    addInputFiles,
    getGlobalAttributes,
    getLatLon,
    selectSourceFile,
    selectSourceFileDirectory,
    updateCurrentCesiumPoints,
    updateCurrentGlobalAttributes
} from "../../actions";
import {remote} from "electron";
import {GeneralAlert} from "../Alerts";
import SourceFileListSingle from "../SourceFileListSingle";
import {getDirectory, getSourceFilesFromPaths} from "../../../common/fileUtils";
import * as path from "path";
import * as selector from "../../selectors";
import {Button} from "@blueprintjs/core";

interface ISourceDataPanelProps {
    dispatch?: Dispatch<State>;
    l1aInputFiles?: SourceFile[];
    selectedSourceFile?: string[];
    currentSourceFileDirectory?: string;
}

function mapStateToProps(state: State): ISourceDataPanelProps {
    return {
        l1aInputFiles: selector.getAddedSourceFiles(state),
        selectedSourceFile: [state.control.selectedSourceFileName],
        currentSourceFileDirectory: state.control.currentSourceFileDirectory
    };
}

class SourceDataPanel extends React.Component<ISourceDataPanelProps, any> {

    constructor(props: ISourceDataPanelProps, context: any) {
        super(props, context);
    }

    public state = {
        isNoFilesAvailableAlertOpen: false,
    };

    private handleSelectFiles = () => {
        const selectedFiles = remote.dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                defaultPath: this.props.currentSourceFileDirectory,
                filters: [
                    {
                        name: "NetCDF files",
                        extensions: ['nc']
                    }
                ]
            }
        );
        if (selectedFiles && selectedFiles.length) {
            const directoryPath = getDirectory(selectedFiles[0]);
            this.props.dispatch(selectSourceFileDirectory(directoryPath));
            const validSourceFiles = getSourceFilesFromPaths(selectedFiles);
            if (validSourceFiles && validSourceFiles.length) {
                this.props.dispatch(addInputFiles(validSourceFiles));
            } else {
                this.setState({
                    isNoFilesAvailableAlertOpen: true
                })
            }
        }
    };

    render() {
        const renderFileList = (itemIndex: number) => {
            const sourceFile = this.props.l1aInputFiles[itemIndex];
            return (
                <SourceFileListSingle sourceFile={sourceFile}/>
            )
        };

        const handleCloseAlert = () => {
            this.setState({
                isNoFilesAvailableAlertOpen: false
            })
        };

        const handleSelectSourceFile = (oldSelection: Array<React.Key>, newSelection: Array<React.Key>) => {
            this.props.dispatch(selectSourceFile(newSelection.length > 0 ? newSelection[0] as string : null));
            if (newSelection[0] || newSelection[0] == 0) {
                const sourceFileIndex = this.props.l1aInputFiles.findIndex((x) => x.name == newSelection[0]);
                this.props.dispatch(getGlobalAttributes(path.join(this.props.l1aInputFiles[sourceFileIndex].path)));
                this.props.dispatch(getLatLon(path.join(this.props.l1aInputFiles[sourceFileIndex].path)));
            } else {
                this.props.dispatch(updateCurrentGlobalAttributes([]));
                this.props.dispatch(updateCurrentCesiumPoints([]));
            }
        };

        return (
            <div className="dedop-collapse">
                <OrdinaryPanelHeader title="L1A Datasets" icon="pt-icon-document"/>
                <div className="dedop-panel-content" style={{textAlign: 'right'}}>
                    <Button className="pt-intent-primary"
                            iconName="pt-icon-add"
                            onClick={this.handleSelectFiles}
                    >
                        Add Files
                    </Button>
                    <ListBox numItems={this.props.l1aInputFiles.length}
                             getItemKey={index => this.props.l1aInputFiles[index].name}
                             renderItem={renderFileList}
                             onSelection={handleSelectSourceFile}
                             selection={this.props.selectedSourceFile ? this.props.selectedSourceFile : []}/>
                </div>
                <GeneralAlert isAlertOpen={this.state.isNoFilesAvailableAlertOpen}
                              onConfirm={handleCloseAlert}
                              message="There are no NetCDF file(s) available in this directory. Please select another directory."
                              iconName="pt-icon-warning-sign"
                />
            </div>
        )
    }
}

export default connect(mapStateToProps)(SourceDataPanel);
