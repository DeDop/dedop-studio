import * as React from "react";
import {State} from "../../state";
import {connect, Dispatch} from "react-redux";
import * as selector from "../../selectors";
import {SelectComponent} from "../common/SelectComponent";
import {Button, Tooltip, Position, AnchorButton} from "@blueprintjs/core";
import * as path from "path";
import {generateAndRunCompareOutputs, generateAndRunInspectOutput} from "../../actions";

interface IAnalysisPanel {
    dispatch?: Dispatch<State>;
    notebookFileNames: string[];
    selectedOutputFileNames: string[];
    outputDirectory: string;
}

function mapStateToProps(state: State): IAnalysisPanel {
    return {
        notebookFileNames: selector.getNotebookFileNames(state),
        selectedOutputFileNames: state.control.selectedOutputFileNames,
        outputDirectory: selector.getOutputDirectory(state)
    }
}

class AnalysisPanel extends React.Component<IAnalysisPanel,any> {
    private handleInspectOutput = () => {
        this.props.dispatch(generateAndRunInspectOutput(path.join(this.props.outputDirectory, this.props.selectedOutputFileNames[0])));
    };

    private handleCompareOutputs = () => {
        if (!this.props.selectedOutputFileNames || this.props.selectedOutputFileNames.length < 2) {
            this.setState({
                isOutputFileNotSelectedAlertOpen: true
            })
        } else {
            this.props.dispatch(generateAndRunCompareOutputs(
                path.join(this.props.outputDirectory, this.props.selectedOutputFileNames[0]),
                path.join(this.props.outputDirectory, this.props.selectedOutputFileNames[1])
            ));
        }
    };

    render() {
        return (
            <div className="dedop-panel-content">
                <div style={{marginBottom: '10px'}}>
                    <Tooltip
                        content="Select an output file to generate and initialise a Jupyter Notebook to inspect this file. Only available when one output file is selected."
                        position={Position.RIGHT_TOP}>
                        <AnchorButton iconName="pt-icon-comparison pt-intent-primary"
                                      onClick={this.handleInspectOutput}
                                      disabled={!this.props.selectedOutputFileNames || this.props.selectedOutputFileNames.length != 1}
                        >
                            Inspect
                        </AnchorButton>
                    </Tooltip>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <Tooltip
                        content="Select two output files to generate and initialise a Jupyter Notebook to compare the results between these two files. Only available when two output files are selected."
                        position={Position.RIGHT_BOTTOM}>
                        <AnchorButton iconName="pt-icon-comparison pt-intent-primary"
                                      onClick={this.handleCompareOutputs}
                                      disabled={!this.props.selectedOutputFileNames || this.props.selectedOutputFileNames.length != 2}
                        >
                            Compare
                        </AnchorButton>
                    </Tooltip>
                </div>
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
