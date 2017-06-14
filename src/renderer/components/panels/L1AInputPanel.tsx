import * as React from "react";
import {Radio} from "@blueprintjs/core";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {SourceFile, State} from "../../state";
import {connect, Dispatch} from "react-redux";
import * as selector from "../../selectors";
import {selectSourceFile, selectSourceFileDirectory, updateSelectedSourceType} from "../../actions";
import {remote} from "electron";
import {getSourceFiles} from "../../../common/sourceFileUtils";
import {GeneralAlert} from "../Alerts";
import {SelectComponent} from "../common/SelectComponent";

interface IL1AInputPanelProps {
    dispatch?: Dispatch<State>;
    sourceFiles?: SourceFile[];
    currentSourceFile?: string;
    currentSourceFileDirectory?: string;
    selectedSourceType?: string;
}

function mapStateToProps(state: State): IL1AInputPanelProps {
    return {
        sourceFiles: selector.getAddedSourceFiles(state),
        currentSourceFile: state.control.selectedSourceFileName,
        currentSourceFileDirectory: state.control.currentSourceFileDirectory,
        selectedSourceType: state.control.selectedSourceType
    }
}

class L1AInputPanel extends React.Component<IL1AInputPanelProps, any> {
    public state = {
        isNoFilesAvailableAlertOpen: false,
    };

    render() {
        const handleSelectSingleFile = () => {
            if (this.props.selectedSourceType != "single") {
                this.props.dispatch(updateSelectedSourceType("single"))
            }
        };

        const handleSelectAllFile = () => {
            if (this.props.selectedSourceType != "all") {
                this.props.dispatch(updateSelectedSourceType("all"))
            }
        };

        let sourceFileNames = [];
        for (let i of this.props.sourceFiles) {
            sourceFileNames.push(i.name);
        }

        const handleOnChangeSourceFile = (event: React.FormEvent<HTMLSelectElement>) => {
            this.props.dispatch(selectSourceFile(event.currentTarget.value));
        };

        const handleCloseAlert = () => {
            this.setState({
                isNoFilesAvailableAlertOpen: false
            })
        };

        const handleSelectDirectory = () => {
            const sourceFileDirectory = remote.dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    defaultPath: this.props.currentSourceFileDirectory
                }
            );
            let validSourceFiles: SourceFile[] = getSourceFiles(sourceFileDirectory[0]);
            if (validSourceFiles.length > 0) {
                this.props.dispatch(selectSourceFileDirectory(sourceFileDirectory[0]));
            } else {
                this.setState({
                    isNoFilesAvailableAlertOpen: true
                })
            }
        };

        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="L1A Input" icon="pt-icon-database"/>
                <div className="dedop-panel-content l1a-input-radio-group">
                    <Radio label="All" value="all"
                           checked={this.props.selectedSourceType == "all"}
                           onChange={handleSelectAllFile}
                           style={{marginRight: '15px'}}
                           disabled={true}
                    />
                    <Radio label="Single file" value="single"
                           checked={this.props.selectedSourceType == "single"}
                           onChange={handleSelectSingleFile}/>
                </div>
                <SelectComponent items={sourceFileNames}
                                 fill={true}
                                 defaultValue="Select a single L1A file..."
                                 selectedItem={this.props.currentSourceFile}
                                 onChange={handleOnChangeSourceFile}
                                 disabled={this.props.selectedSourceType == "all"}
                />
                <GeneralAlert isAlertOpen={this.state.isNoFilesAvailableAlertOpen}
                              onConfirm={handleCloseAlert}
                              message="There are no NetCDF file(s) available in this directory. Please select another directory."
                              iconName="pt-icon-warning-sign"
                />
            </div>
        )
    }
}

export default connect(mapStateToProps)(L1AInputPanel);
