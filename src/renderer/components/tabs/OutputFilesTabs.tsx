import * as React from "react";
import {Tabs, TabList, Tab, TabPanel} from "@blueprintjs/core";
import "codemirror/mode/javascript/javascript";
import {State} from "../../state";
import * as selector from "../../selectors";
import {connect, Dispatch} from "react-redux";
import {getOutputFileNames, updateSelectedOutputs} from "../../actions";
import MouseEventHandler = React.MouseEventHandler;

interface IOutputFilesTabsProps {
    dispatch?: Dispatch<State>;
    outputs: string[];
    selectedOutputFileNames: string[];
}

function mapStateToProps(state: State): IOutputFilesTabsProps {
    return {
        outputs: selector.getOutputNames(state),
        selectedOutputFileNames: state.control.selectedOutputFileNames
    }
}

class OutputFilesTabs extends React.Component<IOutputFilesTabsProps,any> {
    constructor(props) {
        super(props);
        this.handleOnChangeOutputFile = this.handleOnChangeOutputFile.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(getOutputFileNames());
    }

    private handleOnChangeOutputFile = (event: React.FormEvent<HTMLSelectElement>) => {
        const selectedOutput = event.currentTarget.value;
        this.props.dispatch(updateSelectedOutputs([selectedOutput]));
    };

    public render() {
        let outputFiles = [];
        outputFiles.push(<option key="informationText" disabled>Select an output file...</option>);
        for (let i in this.props.outputs) {
            outputFiles.push(<option key={i}>{this.props.outputs[i]}</option>);
        }

        return (
            <div className="dedop-panel-content">
                <Tabs key="horizontal">
                    <TabList>
                        <Tab>Single</Tab>
                        <Tab>Multi</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            <div className="pt-select pt-fill">
                                <select
                                    value={this.props.selectedOutputFileNames ? this.props.selectedOutputFileNames[0] : undefined}
                                    onChange={this.handleOnChangeOutputFile}>
                                    {outputFiles}
                                </select>
                            </div>
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
            </div>
        );
    }
}

export default connect(mapStateToProps)(OutputFilesTabs)
