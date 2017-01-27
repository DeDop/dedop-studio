import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {processingItems} from "../../initialStates";
import ProcessingTable from "../tables/ProcessingTable";

export class ProcessorRunsPanel extends React.Component<any,any> {
    render() {
        return (
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
        )
    }
}
