import * as React from "react";
import {connect} from "react-redux";
import {OrdinaryPanelHeader} from "../panels/PanelHeader";
import OutputFileTabs from "../tabs/OutputFilesTabs";
import AnalysisPanel from "../panels/AnalysisPanel";

interface IResultPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IResultPanelProps {
    return {};
}

export class ResultPanel extends React.Component<IResultPanelProps, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item-configurations">
                    <OrdinaryPanelHeader title="Output Files" icon="pt-icon-document"/>
                    <OutputFileTabs/>
                </div>
                <div className="panel-flexbox-item">
                    <OrdinaryPanelHeader title="Analysis Configuration" icon="pt-icon-timeline-area-chart"/>
                    <AnalysisPanel/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ResultPanel);
