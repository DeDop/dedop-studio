import * as React from "react";
import {Tabs, TabList, Tab, TabPanel, Tooltip} from "@blueprintjs/core";
import "codemirror/mode/javascript/javascript";
import {State} from "../../state";
import * as selector from "../../selectors";
import {connect, Dispatch} from "react-redux";
import {getOutputFileNames, updateSelectedOutputs, inspectOutput, updateOutputFilesTab} from "../../actions";
import {shell} from "electron";
import {GeneralAlert} from "../Alerts";
import MouseEventHandler = React.MouseEventHandler;

interface IOutputFilesTabsProps {
    dispatch?: Dispatch<State>;
    outputs: string[];
    selectedOutputFileNames: string[];
    outputDirectory: string;
    currentTab: number;
}

function mapStateToProps(state: State): IOutputFilesTabsProps {
    return {
        outputs: selector.getOutputNames(state),
        selectedOutputFileNames: state.control.selectedOutputFileNames,
        outputDirectory: selector.getOutputDirectory(state),
        currentTab: state.control.currentOutputFilesTabPanel
    }
}

class OutputFilesTabs extends React.Component<IOutputFilesTabsProps,any> {
    constructor(props) {
        super(props);
        this.handleOnChangeOutputFile = this.handleOnChangeOutputFile.bind(this);
        this.handleInspectOutput = this.handleInspectOutput.bind(this);
        this.handleCloseAlert = this.handleCloseAlert.bind(this);
        this.handleOnChangeMultipleOutputFiles = this.handleOnChangeMultipleOutputFiles.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(getOutputFileNames());
    }

    public state = {
        isOutputFileNotSelectedAlertOpen: false,
    };

    private handleChangeTab = (selectedTabIndex: number) => {
        this.props.dispatch(updateOutputFilesTab(selectedTabIndex));
        this.props.dispatch(updateSelectedOutputs([]));
    };

    private handleOnChangeOutputFile = (event: React.FormEvent<HTMLSelectElement>) => {
        const selectedOutput = event.currentTarget.value;
        this.props.dispatch(updateSelectedOutputs([selectedOutput]));
    };

    private handleOnChangeMultipleOutputFiles = (outputFileOrder: number, event: React.FormEvent<HTMLSelectElement>) => {
        const selectedOutput = event.currentTarget.value;
        let newOutputs = this.props.selectedOutputFileNames;
        if (this.props.selectedOutputFileNames && this.props.selectedOutputFileNames.length > 0) {
            newOutputs[outputFileOrder] = selectedOutput;
        } else {
            if (outputFileOrder == 0) {
                newOutputs = [selectedOutput];
            } else if (outputFileOrder == 1) {
                newOutputs[0] = "";
                newOutputs[1] = selectedOutput;
            }
        }
        this.props.dispatch(updateSelectedOutputs(newOutputs));
    };

    private handleSelectDirectory = () => {
        const openOutputDirectory = shell.openItem(this.props.outputDirectory)
    };

    private handleInspectOutput = (outputFileOrder: number) => {
        if (!this.props.selectedOutputFileNames || !this.props.selectedOutputFileNames[outputFileOrder]) {
            this.setState({
                isOutputFileNotSelectedAlertOpen: true
            })
        } else {
            this.props.dispatch(inspectOutput(this.props.selectedOutputFileNames[outputFileOrder]));
        }
    };

    private handleCloseAlert = () => {
        this.setState({
            isOutputFileNotSelectedAlertOpen: false,
        })
    };

    private getOutputFiles() {
        let outputFiles = [];
        outputFiles.push(<option key="informationText" disabled>Select an output file...</option>);
        for (let i in this.props.outputs) {
            outputFiles.push(<option key={i}>{this.props.outputs[i]}</option>);
        }
        return outputFiles;
    }

    public render() {
        return (
            <div className="dedop-panel-content">
                <Tabs key="horizontal"
                      onChange={this.handleChangeTab}
                      selectedTabIndex={this.props.currentTab ? this.props.currentTab : 0}
                >
                    <TabList>
                        <Tab>Single</Tab>
                        <Tab>Multi</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="panel-flexbox-output-select">
                            <div className="pt-select pt-fill">
                                <select
                                    value={this.props.selectedOutputFileNames ? this.props.selectedOutputFileNames[0] : undefined}
                                    defaultValue="Select an output file..."
                                    onChange={this.handleOnChangeOutputFile}>
                                    {this.getOutputFiles()}
                                </select>
                            </div>
                            <Tooltip content="inspect output file">
                                <span
                                    className="pt-icon-standard pt-icon-document-open panel-flexbox-output-select-icon pt-intent-primary"
                                    onClick={this.handleInspectOutput. bind(null, 0)}
                                />
                            </Tooltip>
                            <Tooltip content="open output directory">
                                <span className="pt-icon-standard pt-icon-folder-open panel-flexbox-output-select-icon"
                                      onClick={this.handleSelectDirectory}
                                />
                            </Tooltip>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            <div className="panel-flexbox-output-select">
                                <div className="pt-select pt-fill" style={{margin: '0 0 10px 0'}}>
                                    <select
                                        value={(this.props.selectedOutputFileNames && this.props.selectedOutputFileNames.length > 0) ? this.props.selectedOutputFileNames[0] : undefined}
                                        defaultValue="Select an output file..."
                                        onChange={this.handleOnChangeMultipleOutputFiles.bind(null, 0)}>
                                        {this.getOutputFiles()}
                                    </select>
                                </div>
                                <Tooltip content="inspect output file">
                                <span
                                    className="pt-icon-standard pt-icon-document-open panel-flexbox-output-select-icon pt-intent-primary"
                                    onClick={this.handleInspectOutput.bind(null, 0)}
                                />
                                </Tooltip>
                                <Tooltip content="open output directory">
                                <span className="pt-icon-standard pt-icon-folder-open panel-flexbox-output-select-icon"
                                      onClick={this.handleSelectDirectory}
                                />
                                </Tooltip>
                            </div>
                            <div className="panel-flexbox-output-select">
                                <div className="pt-select pt-fill">
                                    <select
                                        value={(this.props.selectedOutputFileNames && this.props.selectedOutputFileNames.length > 1) ? this.props.selectedOutputFileNames[1] : undefined}
                                        defaultValue="Select an output file..."
                                        onChange={this.handleOnChangeMultipleOutputFiles.bind(null, 1)}>
                                        {this.getOutputFiles()}
                                    </select>
                                </div>
                                <Tooltip content="inspect output file">
                                <span
                                    className="pt-icon-standard pt-icon-document-open panel-flexbox-output-select-icon pt-intent-primary"
                                    onClick={this.handleInspectOutput.bind(null, 1)}
                                />
                                </Tooltip>
                                <Tooltip content="open output directory">
                                <span className="pt-icon-standard pt-icon-folder-open panel-flexbox-output-select-icon"
                                      onClick={this.handleSelectDirectory}
                                />
                                </Tooltip>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
                <GeneralAlert
                    isAlertOpen={this.state.isOutputFileNotSelectedAlertOpen}
                    onConfirm={this.handleCloseAlert}
                    className="dedop-alert-warning"
                    iconName="pt-icon-warning-sign"
                    message="No output file has been selected"
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(OutputFilesTabs)
