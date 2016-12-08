import * as React from "react";
import * as CodeMirror from "react-codemirror";

import {Tab, TabList, TabPanel, Tabs} from "@blueprintjs/core";
import InputDatasetPanel from './panels/InputDatasetPanel';
import ConfigurationPanel from './panels/ConfigurationPanel';
import ProcessingPanel from './panels/ProcessingPanel';
import ResultPanel from './panels/ResultPanel';
import {ConfigurationEditor} from "./ConfigurationEditor";
import {defaultChdConfigurations, defaultCstConfigurations} from '../initialStates';

require('codemirror/mode/javascript/javascript');

export class MainTabs extends React.Component<any,any> {
    public render() {
        return (
            <Tabs
                className="pt-vertical"
                key="vertical"
            >
                <TabList className="pt-large">
                    <Tab><span className="pt-icon-large pt-icon-database"/></Tab>
                    <Tab><span className="pt-icon-large pt-icon-properties"/></Tab>
                    <Tab><span className="pt-icon-large pt-icon-cog"/></Tab>
                    <Tab><span className="pt-icon-large pt-icon-timeline-bar-chart"/></Tab>
                </TabList>
                <TabPanel>
                    <InputDatasetPanel/>
                </TabPanel>
                <TabPanel>
                    <ConfigurationPanel/>
                </TabPanel>
                <TabPanel>
                    <ProcessingPanel/>
                </TabPanel>
                <TabPanel>
                    <ResultPanel/>
                </TabPanel>
            </Tabs>
        );
    }
}

export class ConfigurationTabs extends React.Component<any,any> {

    constructor() {
        super();
        this.state = {
            codeEditor: false,
            code: "// testCode",
            mode: "markdown"
        };
        this.handleChangeMode = this.handleChangeMode.bind(this);
        this.updateCode = this.updateCode.bind(this);
    }

    private handleChangeMode() {
        this.setState({
            codeEditor: !this.state.codeEditor
        });
    }

    private updateCode(newCode: string) {
        this.setState({
            code: newCode,
        });
    };

    public render() {
        const options = {
            lineNumbers: true,
            mode: this.state.mode
        };

        return (
            <Tabs key="horizontal">
                <TabList>
                    <Tab>Characterization</Tab>
                    <Tab>Configuration</Tab>
                    <Tab>Constants</Tab>
                </TabList>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <label className="pt-control pt-switch">
                            <input type="checkbox" onChange={this.handleChangeMode} checked={this.state.codeEditor}/>
                            <span className="pt-control-indicator"/>
                            Code editor
                        </label>
                        {this.state.codeEditor
                            ?
                            <CodeMirror value={this.state.code} onChange={this.updateCode} options={options}/>
                            :
                            <ConfigurationEditor configurations={defaultChdConfigurations}/>
                        }
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <h4>Properties</h4>
                        <table>
                            <tbody>
                            </tbody>
                        </table>
                        <h4>Flags</h4>
                        <table>
                            <tbody>
                            </tbody>
                        </table>
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <ConfigurationEditor configurations={defaultCstConfigurations}/>
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
            </Tabs>
        );
    }
}
