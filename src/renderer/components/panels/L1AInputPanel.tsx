import * as React from "react";
import {Radio} from "@blueprintjs/core";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {SourceFile, State} from "../../state";
import {connect, Dispatch} from "react-redux";
import * as selector from "../../selectors";
import {
    selectSourceFile,
    selectSourceFileDirectory,
    updateSelectedSourceType
} from "../../actions";
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

class L1AInputPanel extends React.Component<IL1AInputPanelProps,any> {
    public state = {
        isNoFilesAvailableAlertOpen: false,
    };

    render() {
        const handleChange = () => {
            this.props.dispatch(updateSelectedSourceType(this.props.selectedSourceType == "single" ? "directory" : "single"))
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
                    <table width='100%'>
                        <tbody>
                        <tr>
                            <td width='20%'>
                                <Radio label="Single file" value="single"
                                       checked={this.props.selectedSourceType == "single"}
                                       onChange={handleChange}/>
                            </td>
                            <td width='80%'>
                                <SelectComponent items={sourceFileNames}
                                                 fill={true}
                                                 defaultValue="Select a single L1A file..."
                                                 selectedItem={this.props.currentSourceFile}
                                                 onChange={handleOnChangeSourceFile}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Radio label="Directory" value="directory"
                                       checked={this.props.selectedSourceType == "directory"}
                                       onChange={handleChange}/>
                            </td>
                            <td>
                                <div className="pt-input-group">
                                    <input type="text"
                                           className="pt-input"
                                           style={{textAlign: 'left'}}
                                           disabled={this.props.selectedSourceType == "single"}
                                           readOnly={true}
                                           value={this.props.currentSourceFileDirectory}
                                           onClick={handleSelectDirectory}/>
                                    <button className="pt-button pt-minimal pt-icon-folder-open"
                                            onClick={handleSelectDirectory}
                                            disabled={this.props.selectedSourceType == "single"}
                                    />
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
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

export default connect(mapStateToProps)(L1AInputPanel);
