import * as React from "react";
import {OutputFile, State} from "../../state";
import {connect, Dispatch} from "react-redux";
import * as selector from "../../selectors";
import {SelectComponent} from "../common/SelectComponent";
import {AnchorButton, Button, Popover, PopoverInteractionKind, Position} from "@blueprintjs/core";
import * as path from "path";
import {
    generateAndRunCompareOutputs,
    generateAndRunInspectOutput,
    launchNotebook,
    updateSelectedNotebook
} from "../../actions";

interface IAnalysisPanel {
    dispatch?: Dispatch<State>;
    notebookFileNames: string[];
    selectedNotebookFileName: string;
    selectedOutputFiles: OutputFile[];
    outputDirectory: string;
    currentWorkspaceDirectory: string;
}

function mapStateToProps(state: State): IAnalysisPanel {
    return {
        notebookFileNames: selector.getNotebookFileNames(state),
        selectedOutputFiles: state.control.selectedOutputFiles,
        outputDirectory: selector.getOutputDirectory(state),
        selectedNotebookFileName: state.control.selectedNotebookFileName,
        currentWorkspaceDirectory: selector.getWorkspaceDirectory(state)
    }
}

class AnalysisPanel extends React.Component<IAnalysisPanel, any> {
    private constructOutputFilePath(outputFile: OutputFile) {
        return path.join(this.props.currentWorkspaceDirectory,
            'configs', outputFile.config,
            'outputs', outputFile.name);
    }

    private handleInspectOutput = () => {
        const outputFilePath = this.constructOutputFilePath(this.props.selectedOutputFiles[0]);
        this.props.dispatch(generateAndRunInspectOutput(outputFilePath));
    };

    private handleCompareOutputs = () => {
        if (!this.props.selectedOutputFiles || this.props.selectedOutputFiles.length < 2) {
            this.setState({
                isOutputFileNotSelectedAlertOpen: true
            })
        } else {
            this.props.dispatch(generateAndRunCompareOutputs(
                this.constructOutputFilePath(this.props.selectedOutputFiles[0]),
                this.constructOutputFilePath(this.props.selectedOutputFiles[1])
            ));
        }
    };

    private handleOnChangeNotebookName = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.dispatch(updateSelectedNotebook(event.currentTarget.value));
    };

    private handleLaunchNotebook = () => {
        this.props.dispatch(launchNotebook(this.props.selectedNotebookFileName));
    };

    render() {
        let inspectPopoverContent = (
            <div>
                <h6>Inspect output</h6>
                <p style={{fontSize: 12}}>
                    Select an output file to generate and initialise a Jupyter Notebook to inspect this file.</p>
                <p style={{fontSize: 12}}>Only available when <strong>one</strong> output file is selected.</p>
            </div>
        );

        let comparePopoverContent = (
            <div>
                <h6>Compare outputs</h6>
                <p style={{fontSize: 12}}>
                    Select two output files to generate and initialise a Jupyter Notebook to compare the results between
                    these two files.</p>
                <p style={{fontSize: 12}}>Only available when <strong>two</strong> output files are selected.</p>
            </div>
        );

        return (
            <div className="dedop-panel-content">
                <div style={{marginBottom: '10px', marginRight: '10px'}}>
                    <AnchorButton iconName="pt-icon-search pt-intent-primary"
                                  onClick={this.handleInspectOutput}
                                  disabled={!this.props.selectedOutputFiles || this.props.selectedOutputFiles.length != 1}
                    >
                        Inspect
                    </AnchorButton>
                    <Popover
                        content={inspectPopoverContent}
                        interactionKind={PopoverInteractionKind.CLICK}
                        popoverClassName="pt-popover-content-sizing dedop-popover"
                        position={Position.RIGHT}
                        useSmartPositioning={false}
                    >
                        <span className="pt-icon-standard pt-icon-help"
                              style={{marginLeft: '10px', paddingTop: '7px', color: 'rgb(134, 165, 176)'}}
                        />
                    </Popover>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <AnchorButton iconName="pt-icon-comparison pt-intent-primary"
                                  onClick={this.handleCompareOutputs}
                                  disabled={!this.props.selectedOutputFiles || this.props.selectedOutputFiles.length != 2}
                    >
                        Compare
                    </AnchorButton>
                    <Popover
                        content={comparePopoverContent}
                        interactionKind={PopoverInteractionKind.CLICK}
                        popoverClassName="pt-popover-content-sizing dedop-popover"
                        position={Position.RIGHT}
                        useSmartPositioning={false}
                    >
                        <span className="pt-icon-standard pt-icon-help"
                              style={{marginLeft: '10px', paddingTop: '7px', color: 'rgb(134, 165, 176)'}}
                        />
                    </Popover>
                </div>
                <div className="pt-select pt-fill">
                    <SelectComponent items={this.props.notebookFileNames}
                                     fill={true}
                                     defaultValue="Select a notebook file..."
                                     selectedItem={this.props.selectedNotebookFileName}
                                     onChange={this.handleOnChangeNotebookName}
                    />
                </div>
                <div style={{textAlign: 'right'}}>
                    <Button className="pt-button pt-intent-primary"
                            style={{margin: '10px 0'}}
                            iconName='pt-icon-play'
                            onClick={this.handleLaunchNotebook}
                            disabled={!this.props.selectedNotebookFileName}
                    >
                        Launch notebook
                    </Button>
                </div>
                <textarea className="pt-input pt-fill"
                          dir="auto"
                          placeholder="create your own Python script (not yet implemented)"
                          style={{overflow: "auto", margin: '10px 0'}}
                          disabled={true}
                />
                <div className="pt-select pt-fill">
                    <select disabled={true}>
                        <option placeholder="">or select a Python script...</option>
                        <option value="1">compare-1.py</option>
                        <option value="2">inspect-1.py</option>
                    </select>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(AnalysisPanel);
