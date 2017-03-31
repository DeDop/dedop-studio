import * as React from "react";
import {State} from "../../state";
import {connect} from "react-redux";

interface IAnalysisPanel {
    notebookFileNames: string[];
}

function mapStateToProps(state: State): IAnalysisPanel {
    return {
        notebookFileNames: []
    }
}

class AnalysisPanel extends React.Component<any,any> {
    render() {
        return (
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
        )
    }
}

export default connect(mapStateToProps)(AnalysisPanel);
