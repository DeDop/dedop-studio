import * as React from "react";
import * as moment from "moment";
import {OrdinaryPanelHeader} from "./PanelHeader";
import ProcessingTable from "../tables/ProcessingTable";
import {ProcessingItem, State, ProcessingStatus} from "../../state";
import {connect} from "react-redux";
import {addNewProcess} from "../../actions";

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
            this.props.dispatch(addNewProcess(processItem));
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
            </div>
        )
    }
}

export default connect(mapStateToProps)(ProcessorRunsPanel);
