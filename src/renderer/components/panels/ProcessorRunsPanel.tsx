import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import ProcessingTable from "../tables/ProcessingTable";
import {ProcessingItem, SourceFile, State} from "../../state";
import {connect, Dispatch} from "react-redux";
import {removeProcess, runProcess, updateSelectedProcesses} from "../../actions";
import * as selector from "../../selectors";
import {Button, Dialog} from "@blueprintjs/core";
import {JobStatusEnum} from "../../webapi/Job";

interface IProcessorRunsPanelProps {
    dispatch?: Dispatch<State>;
    selectedSourceFile: SourceFile;
    currentConfiguration: string;
    currentOutputDirectory: string;
    processName: string;
    processes: ProcessingItem[];
    selectedProcesses: number[];
    outputNames: string[];
}

function mapStateToProps(state: State): IProcessorRunsPanelProps {
    return {
        selectedSourceFile: selector.getSelectedSourceFile(state),
        currentConfiguration: state.control.currentConfigurationName,
        currentOutputDirectory: state.control.currentOutputDirectory,
        processName: state.control.processName,
        processes: state.data.processes,
        selectedProcesses: state.control.selectedProcesses,
        outputNames: selector.getOutputNames(state)
    }
}

class ProcessorRunsPanel extends React.Component<IProcessorRunsPanelProps, any> {
    public state = {
        isIncompleteDataDialogOpen: false,
        isOutputFileExistDialogOpen: false
    };

    successfulTag = <span className="pt-tag pt-intent-success">OK</span>;
    missingTag = <span className="pt-tag pt-intent-danger">Missing</span>;

    renderIncompleteValuesMessage = () => {
        return (
            <div>
                <table className="dedop-table-missing-parameters">
                    <tbody>
                    <tr>
                        <td>Input file</td>
                        <td> :</td>
                        <td>{this.props.selectedSourceFile ? this.props.selectedSourceFile.path : ""}</td>
                        <td>{this.props.selectedSourceFile ? this.successfulTag : this.missingTag}</td>
                    </tr>
                    <tr>
                        <td>Configuration</td>
                        <td> :</td>
                        <td>{this.props.currentConfiguration ? this.props.currentConfiguration : ""}</td>
                        <td>{this.props.currentConfiguration ? this.successfulTag : this.missingTag}</td>
                    </tr>
                    <tr>
                        <td>Output directory</td>
                        <td> :</td>
                        <td>{this.props.currentOutputDirectory ? this.props.currentOutputDirectory : ""}</td>
                        <td>{this.props.currentOutputDirectory ? this.successfulTag : this.missingTag}</td>
                    </tr>
                    </tbody>
                </table>
            </div>)
    };

    private static getFileBaseName(fileName: string) {
        let baseName = String(fileName).substring(fileName.lastIndexOf('/') + 1);
        if (baseName.lastIndexOf(".") != -1)
            baseName = baseName.substring(0, baseName.lastIndexOf("."));
        return baseName;
    };

    private doRunProcess() {
        this.props.dispatch(runProcess(this.props.currentConfiguration, this.props.currentOutputDirectory, this.props.selectedSourceFile.path));
    };

    private handleRunProcess = () => {
        if (!this.props.selectedSourceFile || !this.props.currentConfiguration || !this.props.currentOutputDirectory) {
            this.setState({
                isIncompleteDataDialogOpen: true
            })
        } else {
            const sourceFileBaseName = ProcessorRunsPanel.getFileBaseName(this.props.selectedSourceFile.name);
            const newOutputName = "L1B_" + sourceFileBaseName + "_" + this.props.currentConfiguration + ".nc";
            let isOutputFileExist = false;
            for (let outputName of this.props.outputNames) {
                if (newOutputName == outputName) {
                    isOutputFileExist = true;
                    break;
                }
            }
            if (isOutputFileExist) {
                this.setState({
                    isOutputFileExistDialogOpen: true
                })
            } else {
                this.doRunProcess();
            }
        }
    };

    private handleDeleteProcesses = () => {
        for (let i of this.props.selectedProcesses) {
            for (let j of this.props.processes) {
                if (j.id == i) {
                    this.props.dispatch(removeProcess(i));
                }
            }
        }
        this.props.dispatch(updateSelectedProcesses([]));
    };

    private handleCloseIncompleteParameterDialogAlert = () => {
        this.setState({
            isIncompleteDataDialogOpen: false
        })
    };

    private handleOverwriteFile = () => {
        this.doRunProcess();
        this.setState({
            isOutputFileExistDialogOpen: false
        })
    };

    private handleCloseOutputFileExistAlert = () => {
        this.setState({
            isOutputFileExistDialogOpen: false
        })
    };

    render() {
        let isProcessRunningOrSubmitted = false;
        for (let process of this.props.processes) {
            if (process.status == JobStatusEnum.IN_PROGRESS || process.status == JobStatusEnum.SUBMITTED) {
                isProcessRunningOrSubmitted = true;
            }
        }

        return (
            <div className="panel-flexbox-item">
                <OrdinaryPanelHeader title="Processor Runs" icon="pt-icon-cog"/>
                <div style={{textAlign: 'right'}}>
                    <button type="button"
                            className="pt-button pt-icon-standard pt-icon-delete pt-intent-danger"
                            style={{margin: '10px 0'}}
                            onClick={this.handleDeleteProcesses}
                            disabled={!(this.props.selectedProcesses && this.props.selectedProcesses.length > 0)}
                    >
                        Delete
                    </button>
                    <Button type="button"
                            className="pt-button pt-icon-standard pt-icon-play pt-intent-primary"
                            style={{margin: '10px 0 10px 5px'}}
                            onClick={this.handleRunProcess}
                            loading={isProcessRunningOrSubmitted}
                    >
                        Run
                    </Button>
                </div>
                <ProcessingTable/>
                <Dialog isOpen={this.state.isIncompleteDataDialogOpen}
                        onClose={this.handleCloseIncompleteParameterDialogAlert}
                        title="Incomplete parameters"
                        className="dedop-dialog-missing-parameters"
                >
                    <div className="pt-dialog-body">
                        {this.renderIncompleteValuesMessage()}
                    </div>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button onClick={this.handleCloseIncompleteParameterDialogAlert}
                                    text="Close"
                            />
                        </div>
                    </div>
                </Dialog>
                <Dialog isOpen={this.state.isOutputFileExistDialogOpen}
                        onClose={this.handleCloseOutputFileExistAlert}
                        title="Incomplete parameters"
                        className="dedop-dialog-missing-parameters"
                >
                    <div className="pt-dialog-body">
                        Output file with the same configuration exists. Do you want to overwrite it?
                    </div>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button onClick={this.handleOverwriteFile}
                                    text="Yes"
                            />
                            <Button onClick={this.handleCloseOutputFileExistAlert}
                                    text="No"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ProcessorRunsPanel);
