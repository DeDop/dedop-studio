import * as React from 'react';
import {connect} from "react-redux";
import {updatePanelTitle} from "../../actions";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {OutputFilesTreeMenu} from "../TreeMenu";
import {AnalysisTabs} from "../AnalysisTabs";

interface IResultPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IResultPanelProps {
    return {};
}

export class ResultPanel extends React.Component<IResultPanelProps, any> {
    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Results & Analysis"));
    }

    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item-configurations">
                    <OrdinaryPanelHeader title="Output Files" icon="pt-icon-document"/>
                    <AnalysisTabs/>
                    <button className="pt-button pt-intent-primary">
                        Open Folder
                    </button>
                </div>
                <div className="panel-flexbox-item">
                    <OrdinaryPanelHeader title="Analysis Configuration" icon="pt-icon-timeline-area-chart"/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ResultPanel);
