import * as React from "react";
import {Tabs, TabList, Tab, TabPanel, Tooltip} from "@blueprintjs/core";
import "codemirror/mode/javascript/javascript";
import {State} from "../../state";
import * as selector from "../../selectors";
import {connect, Dispatch} from "react-redux";
import {getOutputFileNames, updateSelectedOutputs, inspectOutput, updateOutputFilesTab} from "../../actions";
import {shell} from "electron";
import MouseEventHandler = React.MouseEventHandler;
import {GeneralAlert} from "../Alerts";

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

    private handleSelectDirectory = () => {
        const openOutputDirectory = shell.openItem(this.props.outputDirectory)
    };

    private handleInspectOutput = () => {
        if (!this.props.selectedOutputFileNames) {
            this.setState({
                isOutputFileNotSelectedAlertOpen: true
            })
        }
        this.props.dispatch(inspectOutput(this.props.selectedOutputFileNames[0]));
    };

    private handleCloseAlert = () => {
        this.setState({
            isOutputFileNotSelectedAlertOpen: false,
        })
    };

    public render() {
        let outputFiles = [];
        outputFiles.push(<option key="informationText" disabled>Select an output file...</option>);
        for (let i in this.props.outputs) {
            outputFiles.push(<option key={i}>{this.props.outputs[i]}</option>);
        }

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
                                    {outputFiles}
                                </select>
                            </div>
                            <Tooltip content="inspect output file">
                                <span
                                    className="pt-icon-standard pt-icon-document-open panel-flexbox-output-select-icon pt-intent-primary"
                                    onClick={this.handleInspectOutput}
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
                            <div className="pt-select pt-fill" style={{margin: '0 0 10px 0'}}>
                                <select>
                                    <option selected>Select a configuration 1...</option>
                                    <option value="1">Alternate Delay-Doppler Processing</option>
                                    <option value="2">Modified Surface Locations</option>
                                </select>
                            </div>
                            <div className="pt-select pt-fill">
                                <select>
                                    <option selected>Select a configuration 2...</option>
                                    <option value="1">Alternate Delay-Doppler Processing</option>
                                    <option value="2">Modified Surface Locations</option>
                                </select>
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
