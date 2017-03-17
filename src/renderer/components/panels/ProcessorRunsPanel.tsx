import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import ProcessingTable from "../tables/ProcessingTable";
import {State, SourceFile} from "../../state";
import {connect, Dispatch} from "react-redux";
import {runProcess} from "../../actions";
import {GeneralAlert} from "../Alerts";
import * as selector from "../../selectors";

interface IProcessorRunsPanelProps {
    dispatch?: Dispatch<State>;
    selectedSourceFile: SourceFile;
    currentConfiguration: string;
    currentOutputDirectory: string;
    processName: string;
}

function mapStateToProps(state: State): IProcessorRunsPanelProps {
    return {
        selectedSourceFile: selector.getSelectedSourceFile(state),
        currentConfiguration: state.control.currentConfigurationName,
        currentOutputDirectory: state.control.currentOutputDirectory,
        processName: state.control.processName
    }
}

class ProcessorRunsPanel extends React.Component<IProcessorRunsPanelProps,any> {
    public state = {
        isIncompleteDataDialogOpen: false
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

        const handleCloseNameAlert = () => {
            this.setState({
                isIncompleteDataDialogOpen: false
            })
        };

        return (
            <div className="panel-flexbox-item">
                <OrdinaryPanelHeader title="Processor Runs" icon="pt-icon-cog"/>
                <div style={{textAlign: 'right'}}>
                    <button type="button" className="pt-button pt-icon-standard pt-icon-play pt-intent-primary"
                            style={{margin: '10px 0'}} onClick={handleRunProcess}>
                        Run
                    </button>
                </div>
                <ProcessingTable/>
                <GeneralAlert isAlertOpen={this.state.isIncompleteDataDialogOpen}
                              message="Process name is invalid"
                              onConfirm={handleCloseNameAlert}
                              iconName="pt-icon-warning-sign"
                />
            </div>
        )
    }
}

export default connect(mapStateToProps)(ProcessorRunsPanel);
