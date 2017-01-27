import * as React from "react";
import {connect} from "react-redux";
import {updatePanelTitle} from "../../actions";
import {OrdinaryPanelHeader} from "../panels/PanelHeader";
import {AnalysisTabs} from "../tabs/AnalysisTabs";

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
                    <div style={{textAlign: 'right'}}>
                        <button className="pt-button pt-intent-primary" style={{margin: '10px 0'}}>
                            Open Folder
                        </button>
                    </div>
                </div>
                <div className="panel-flexbox-item">
                    <OrdinaryPanelHeader title="Analysis Configuration" icon="pt-icon-timeline-area-chart"/>
                    <div className="dedop-panel-content">
                        <div className="pt-select pt-fill">
                            <select>
                                <option selected>Select a notebook file...</option>
                                <option value="1">compare-1.ipynb</option>
                                <option value="2">inspect-1.ipynb</option>
                            </select>
                        </div>
                        <textarea className="pt-input pt-fill"
                                  dir="auto"
                                  placeholder="create your own Python script"
                                  style={{overflow: "auto", margin: '10px 0'}}
                        />
                        <div className="pt-select pt-fill">
                            <select>
                                <option placeholder="">or select a Python script...</option>
                                <option value="1">compare-1.py</option>
                                <option value="2">inspect-1.py</option>
                            </select>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <button className="pt-button pt-intent-primary" style={{margin: '10px 0'}}>
                                Run
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ResultPanel);
