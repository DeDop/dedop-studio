import * as React from "react";
import {OrdinaryPanelHeader} from "../panels/PanelHeader";
import {ListBox} from "../ListBox";
import {State, SourceFile} from "../../state";
import {connect, Dispatch} from "react-redux";
import {
    selectSourceFile,
    selectSourceFileDirectory,
    updateSourceFileList,
    getGlobalAttributes,
    updateCurrentGlobalAttributes
} from "../../actions";
import {remote} from "electron";
import {GeneralAlert} from "../Alerts";
import SourceFileListSingle from "../SourceFileListSingle";
import {getSourceFiles} from "../../../common/sourceFileUtils";
import * as path from "path";

interface ISourceDataPanelProps {
    dispatch?: Dispatch<State>;
    l1aInputFiles: SourceFile[];
    selectedSourceFile: string[];
    currentSourceFileDirectory: string;
}

function mapStateToProps(state: State): ISourceDataPanelProps {
    return {
        l1aInputFiles: state.control.sourceFiles,
        selectedSourceFile: [state.control.selectedSourceFile],
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
            } else {
                this.props.dispatch(updateCurrentGlobalAttributes([]));
            }
        };

        const handleSelectDirectory = () => {
            const sourceFileDirectory = remote.dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    defaultPath: this.props.currentSourceFileDirectory
                }
            );
            this.props.dispatch(selectSourceFileDirectory(sourceFileDirectory[0]));
            let validSourceFiles: SourceFile[] = getSourceFiles(sourceFileDirectory[0]);
            if (validSourceFiles.length > 0) {
                this.props.dispatch(updateSourceFileList(validSourceFiles));
            } else {
                this.setState({
                    isNoFilesAvailableAlertOpen: true
                })
            }
        };

        return (
            <div className="dedop-collapse">
                <OrdinaryPanelHeader title="L1A Datasets" icon="pt-icon-document"/>
                <div className="dedop-panel-content">
                    <div className="pt-input-group">
                        <input className="pt-input"
                               type="text"
                               placeholder="Choose directory..."
                               style={{textAlign: 'left'}}
                               readOnly={true}
                               value={this.props.currentSourceFileDirectory}
                               onClick={handleSelectDirectory}
                        />
                        <button className="pt-button pt-minimal pt-icon-folder-open"
                                onClick={handleSelectDirectory}
                        />
                    </div>
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
