import * as React from "react";
import {connect} from "react-redux";

import {DedopRunSettingsCollapse, DedopL1aInputCollapse, DedopRunOutputCollapse} from "../Collapse";
import {FootprintsPanel} from "./FootprintsPanel";
import {OrdinaryPanelHeader} from "./PanelHeader";
import ProcessingTable from "../ProcessingTable";
import {processingItems} from "../../initialStates";
import {updatePanelTitle} from "../../actions";


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
                        <DedopL1aInputCollapse panelTitle="L1A Input" collapseIcon="pt-icon-database"/>
                        <DedopRunSettingsCollapse panelTitle="Run Settings" collapseIcon="pt-icon-properties"/>
                        <DedopRunOutputCollapse panelTitle="L1B & L1BS Output" collapseIcon="pt-icon-document"/>

                    </div>
                    <div className="panel-flexbox-item">
                        <OrdinaryPanelHeader title="Processor Runs" icon="pt-icon-cog"/>
                        <div style={{textAlign: 'right'}}>
                            <button type="button" className="pt-button pt-icon-standard pt-icon-play pt-intent-primary"
                                    style={{margin: '10px 0'}}>
                                Run
                            </button>
                        </div>
                        <ProcessingTable processingItems={processingItems}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ProcessingPanel);
