import * as React from 'react';
import {OutputFile, State} from '../../state';
import {connect, Dispatch} from 'react-redux';
import * as selector from '../../selectors';
import {SelectComponent} from '../common/SelectComponent';
import {Button} from '@blueprintjs/core';
import * as path from 'path';
import {
    generateAndRunCompareOutputs,
    generateAndRunInspectOutput,
    launchNotebook,
    updateSelectedNotebook
} from '../../actions';

interface IAnalysisPanel {
    dispatch?: Dispatch<State>;
    notebookFileNames?: string[];
    selectedNotebookFileName?: string;
    selectedOutputFiles?: OutputFile[];
    outputDirectory?: string;
    currentWorkspaceDirectory?: string;
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
        return (
            <div className="dedop-panel-content">
                <h5>Inspect output</h5>
                <p style={{fontSize: 14}}>
                    Select an output file to generate and initialise a Jupyter Notebook to inspect this file.</p>
                <p style={{fontSize: 14}}>Only available when <strong>one</strong> output file is selected.</p>
                <div style={{marginBottom: '10px', marginRight: '10px'}}>
                    <Button iconName="pt-icon-search"
                            className="pt-intent-primary"
                            onClick={this.handleInspectOutput}
                            disabled={!this.props.selectedOutputFiles || this.props.selectedOutputFiles.length != 1}
                    >
                        Inspect
                    </Button>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <h5>Compare outputs</h5>
                    <p style={{fontSize: 14}}>
                        Select two output files to generate and initialise a Jupyter Notebook to compare the results
                        between
                        these two files.</p>
                    <p style={{fontSize: 14}}>Only available when <strong>two</strong> output files are selected.</p>
                    <Button iconName="pt-icon-comparison"
                            className="pt-intent-primary"
                            onClick={this.handleCompareOutputs}
                            disabled={!this.props.selectedOutputFiles || this.props.selectedOutputFiles.length != 2}
                    >
                        Compare
                    </Button>
                </div>
                <div>
                    <h5>Launch notebook</h5>
                    <p style={{fontSize: 14}}>
                        Select a generated notebook file from the dropdown list below and then click the Launch notebook
                        button.
                        A Jupyter Notebook server will be started with the selected notebook file.
                        If no notebook files are available, create one by running <strong>Inspect output</strong> or
                        <strong>Compare outputs</strong> above.
                    </p>
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
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(AnalysisPanel);
