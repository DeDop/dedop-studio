import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {OrdinaryPanelHeader} from "../panels/PanelHeader";
import AnalysisPanel from "../panels/AnalysisPanel";
import {State} from "../../state";
import OutputFilesTreeMenu from "../OutputFilesTreeMenu";

interface IResultPanelProps {
    dispatch?: Dispatch<State>;
}

function mapStateToProps(): IResultPanelProps {
    return {};
}

export class ResultPanel extends React.Component<IResultPanelProps, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item-static-50">
                    <OrdinaryPanelHeader title="Output Files" icon="pt-icon-document"/>
                    <OutputFilesTreeMenu/>
                </div>
                <div className="panel-flexbox-item-static-40">
                    <OrdinaryPanelHeader title="Analysis Configuration" icon="pt-icon-timeline-area-chart"/>
                    <AnalysisPanel/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ResultPanel);
