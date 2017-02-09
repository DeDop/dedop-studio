import * as React from "react";
import {OrdinaryPanelHeader} from "../panels/PanelHeader";
import {ListBox} from "../ListBox";
import {State, SourceFile} from "../../state";
import {connect, Dispatch} from "react-redux";
import {selectSourceFile, selectSourceFileDirectory, updateSourceFileList, testWebSocket} from "../../actions";
import {remote} from "electron";
import * as moment from "moment";
import {GeneralAlert} from "../Alerts";
import SourceFileListSingle from "../SourceFileListSingle";
import {Button} from "@blueprintjs/core";

interface ISourceDataPanelProps {
    dispatch?: Dispatch<State>;
    l1aInputFileNames: SourceFile[];
    selectedSourceFile: string[];
    currentSourceFileDirectory: string;
}

function mapStateToProps(state: State): ISourceDataPanelProps {
    return {
        l1aInputFileNames: state.data.sourceFiles,
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
            const sourceFile = this.props.l1aInputFileNames[itemIndex];
            return (
                <SourceFileListSingle sourceFile={sourceFile} itemIndex={itemIndex}/>
            )
        };

        const handleCloseAlert = () => {
            this.setState({
                isNoFilesAvailableAlertOpen: false
            })
        };

        const handleSelectSourceFile = (oldSelection: Array<React.Key>, newSelection: Array<React.Key>) => {
            this.props.dispatch(selectSourceFile(newSelection.length > 0 ? newSelection[0] as number : null));
        };

        const handleSelectDirectory = () => {
            const sourceFileDirectory = remote.dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    defaultPath: this.props.currentSourceFileDirectory
                }
            );
            this.props.dispatch(selectSourceFileDirectory(sourceFileDirectory[0]));
            const electronFs = remote.require("fs");
            let sourceFiles = electronFs.readdirSync(sourceFileDirectory[0]);
            let validSourceFiles: SourceFile[] = [];
            for (let fileName of sourceFiles) {
                if (fileName.endsWith(".nc")) {
                    const stats = electronFs.statSync(sourceFileDirectory[0].concat("\\").concat(fileName));
                    validSourceFiles.push({
                        name: fileName,
                        size: stats.size / (1024 * 1024),
                        lastUpdated: moment(stats.mtime.toISOString()).format("DD/MM/YY, hh:mm:ss"),
                        globalMetadata: []
                    });
                }

            }
            if (validSourceFiles.length > 0) {
                this.props.dispatch(updateSourceFileList(validSourceFiles));
            } else {
                this.setState({
                    isNoFilesAvailableAlertOpen: true
                })
            }
        };

        const handleTestButton = () => {
            this.props.dispatch(testWebSocket())
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
                    <ListBox numItems={this.props.l1aInputFileNames.length}
                             renderItem={renderFileList}
                             onSelection={handleSelectSourceFile}
                             selection={this.props.selectedSourceFile ? this.props.selectedSourceFile : []}/>
                </div>
                <Button onClick={handleTestButton} className="pt-intent-primary">Test</Button>
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
