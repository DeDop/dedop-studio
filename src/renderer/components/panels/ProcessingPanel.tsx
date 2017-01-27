import * as React from "react";
import {connect} from "react-redux";
import {L1AInputPanel} from "./L1AInputPanel";
import {updatePanelTitle} from "../../actions";
import {RunSettingsPanel} from "./RunSettingsPanel";
import {L1BL1BSOutputPanel} from "./L1BL1BSOutputPanel";
import {ProcessorRunsPanel} from "./ProcessorRunsPanel";


interface IProcessingPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IProcessingPanelProps {
    return {};
}

class ProcessingPanel extends React.Component<IProcessingPanelProps, any> {
    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Processing"));
    }

    public render() {
        return (
            <div className="panel-flexbox-vertical">
                <div className="panel-flexbox">
                    <div className="flexbox-item-pico-config">
                        <L1AInputPanel/>
                        <RunSettingsPanel/>
                        <L1BL1BSOutputPanel/>
                    </div>
                    <ProcessorRunsPanel/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ProcessingPanel);
