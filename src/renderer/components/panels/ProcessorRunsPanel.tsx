import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import ProcessingTable from "../tables/ProcessingTable";
import {State, SourceFile, ProcessingItem} from "../../state";
import {connect, Dispatch} from "react-redux";
import {runProcess, removeProcess, updateSelectedProcesses} from "../../actions";
import * as selector from "../../selectors";
import {Dialog, Button} from "@blueprintjs/core";

interface IProcessorRunsPanelProps {
    dispatch?: Dispatch<State>;
    selectedSourceFile: SourceFile;
    currentConfiguration: string;
    currentOutputDirectory: string;
    processName: string;
    processes: ProcessingItem[];
    selectedProcesses: number[];
}

function mapStateToProps(state: State): IProcessorRunsPanelProps {
    return {
        selectedSourceFile: selector.getSelectedSourceFile(state),
        currentConfiguration: state.control.currentConfigurationName,
        currentOutputDirectory: state.control.currentOutputDirectory,
        processName: state.control.processName,
        processes: state.data.processes,
        selectedProcesses: state.control.selectedProcesses
    }
}

class ProcessorRunsPanel extends React.Component<IProcessorRunsPanelProps,any> {
    public state = {
        isIncompleteDataDialogOpen: false
    };

    successfulTag = <span className="pt-tag pt-intent-success">OK</span>;
    missingTag = <span className="pt-tag pt-intent-danger">Missing</span>;

    renderIncompleteValuesMessage = () => {
        return (
            <div>
                <table className="dedop-table-missing-parameters">
                    <tbody>
                    <tr>
                        <td>Process name</td>
                        <td> :</td>
                        <td>{this.props.processName ? this.props.processName : ""}</td>
                        <td>{this.props.processName ? this.successfulTag : this.missingTag}</td>
                    </tr>
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

    render() {
        const handleRunProcess = () => {
            // TODO (hans-permana, 20170214): add checking to input dataset as well as output directory
            if (!this.props.processName || !this.props.selectedSourceFile || !this.props.currentConfiguration || !this.props.currentOutputDirectory) {
                this.setState({
                    isIncompleteDataDialogOpen: true
                })
            } else {
                this.props.dispatch(runProcess(this.props.processName, this.props.currentOutputDirectory, this.props.selectedSourceFile.path));
            }
        };

        const handleCloseIncompleteParameterDialogAlert = () => {
            this.setState({
                isIncompleteDataDialogOpen: false
            })
        };

        const handleDeleteProcesses = () => {
            for (let i of this.props.selectedProcesses) {
                for (let j of this.props.processes) {
                    if (j.id == i) {
                        this.props.dispatch(removeProcess(i));
                    }
                }
            }
            this.props.dispatch(updateSelectedProcesses([]));
        };

        return (
            <div className="panel-flexbox-item">
                <OrdinaryPanelHeader title="Processor Runs" icon="pt-icon-cog"/>
                <div style={{textAlign: 'right'}}>
                    <button type="button"
                            className="pt-button pt-icon-standard pt-icon-delete pt-intent-danger"
                            style={{margin: '10px 0'}}
                            onClick={handleDeleteProcesses}
                            disabled={!(this.props.selectedProcesses && this.props.selectedProcesses.length > 0)}
                    >
                        Delete
                    </button>
                    <button type="button" className="pt-button pt-icon-standard pt-icon-play pt-intent-primary"
                            style={{margin: '10px 0 10px 5px'}} onClick={handleRunProcess}>
                        Run
                    </button>
                </div>
                <ProcessingTable/>
                <Dialog isOpen={this.state.isIncompleteDataDialogOpen}
                        onClose={handleCloseIncompleteParameterDialogAlert}
                        title="Incomplete parameters"
                        className="dedop-dialog-missing-parameters"
                >
                    <div className="pt-dialog-body">
                        {this.renderIncompleteValuesMessage()}
                    </div>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button onClick={handleCloseIncompleteParameterDialogAlert}
                                    text="Close"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ProcessorRunsPanel);
