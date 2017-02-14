import * as React from "react";
import * as moment from "moment";
import {OrdinaryPanelHeader} from "./PanelHeader";
import ProcessingTable from "../tables/ProcessingTable";
import {ProcessingItem, State, ProcessingStatus} from "../../state";
import {connect} from "react-redux";
import {addNewProcess} from "../../actions";
import {GeneralAlert} from "../Alerts";

interface IProcessorRunsPanelProps {
    dispatch?: (action: {type: string, payload: ProcessingItem}) => void;
    selectedSourceFile: string;
    currentConfiguration: string;
    processName: string;
}

function mapStateToProps(state: State): IProcessorRunsPanelProps {
    return {
        selectedSourceFile: state.control.selectedSourceFile,
        currentConfiguration: state.control.currentConfiguration,
        processName: state.control.processName
    }
}

class ProcessorRunsPanel extends React.Component<IProcessorRunsPanelProps,any> {
    public state = {
        isNameAlertOpen: false
    };

    render() {
        const handleRunProcess = () => {
            const currentTime = moment().format("DD/MM/YY, HH:mm:ss");
            const processingStatus = ProcessingStatus[ProcessingStatus.QUEUED];
            const processItem: ProcessingItem = {
                id: "",
                name: this.props.processName,
                configuration: this.props.currentConfiguration,
                processingDuration: "-",
                status: processingStatus,
                startedTime: currentTime
            };
            // TODO (hans-permana, 20170214): add checking to input dataset as well as output directory
            if (!processItem.name) {
                this.setState({
                    isNameAlertOpen: true
                })
            } else {
                this.props.dispatch(addNewProcess(processItem));
            }
        };

        const handleCloseNameAlert = () => {
            this.setState({
                isNameAlertOpen: false
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
                <GeneralAlert isAlertOpen={this.state.isNameAlertOpen}
                              message="Process name is invalid"
                              onConfirm={handleCloseNameAlert}
                              iconName="pt-icon-warning-sign"
                />
            </div>
        )
    }
}

export default connect(mapStateToProps)(ProcessorRunsPanel);
