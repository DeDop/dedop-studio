import * as React from "react";
import {State} from "../../state";
import {connect} from "react-redux";
import * as selector from "../../selectors";
import {SelectComponent} from "../common/SelectComponent";

interface IAnalysisPanel {
    notebookFileNames: string[];
}

function mapStateToProps(state: State): IAnalysisPanel {
    return {
        notebookFileNames: selector.getNotebookFileNames(state)
    }
}

class AnalysisPanel extends React.Component<IAnalysisPanel,any> {
    render() {
        return (
            <div className="dedop-panel-content">
                <div className="pt-select pt-fill">
                    <SelectComponent items={this.props.notebookFileNames}
                                     fill={true}
                                     defaultValue="Select a notebook file..."
                    />
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
