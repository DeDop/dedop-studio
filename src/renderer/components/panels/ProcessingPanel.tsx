import * as React from "react";
import {connect} from "react-redux";

import {DedopRunSettingsCollapse, DedopL1aInputCollapse} from "../Collapse";
import {FootprintsPanel} from "../FootprintsPanel";
import {OrdinaryPanelHeader} from "../PanelHeader";
import {ProcessingTable} from "../ProcessingTable";
import {processingItems} from "../../initialStates";
import {updatePanelTitle} from "../../actions";


interface IProcessingPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IProcessingPanelProps {
    return {};
}

class ProcessingPanel extends React.Component<IProcessingPanelProps, any> {
    componentWillMount(){
        this.props.dispatch(updatePanelTitle("Processing"));
    }

    public render() {
        return (
            <div className="panel-flexbox">
                <div className="flexbox-item-pico-config">
                    <DedopRunSettingsCollapse panelTitle="Run Settings" collapseIcon="pt-icon-settings"/>
                    <DedopL1aInputCollapse panelTitle="L1A Input" collapseIcon="pt-icon-properties"/>
                    <button type="button" className="pt-button pt-fill">Run</button>
                </div>
                <div className="flexbox-item-pico-footprints">
                    <FootprintsPanel/>
                </div>
                <div className="flexbox-item-pico-runs">
                    <OrdinaryPanelHeader title="Processor Runs" icon="pt-icon-th-list"/>
                    <ProcessingTable processingItems={processingItems}/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ProcessingPanel);
