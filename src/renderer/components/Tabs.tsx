import * as React from "react";
import * as CodeMirror from "react-codemirror";

import {Tab, TabList, TabPanel, Tabs} from "@blueprintjs/core";
import {ConfigurationPanel, ProcessingPanel, ResultPanel} from './Panels';
import InputDatasetPanel from './InputDatasetPanel';
import {DedopCollapse, DedopConfigCollapse} from "./Collapse";
import {ConfigurationSingleEntry} from "./ConfigurationSingleEntry";

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
            // Still not working yet because this tab's style is still influenced by the parents' style (pt-vertical)
            // TODO need to find a way to avoid an influence by the parents' styling.
            <Tabs key="horizontal">
                <TabList>
                    <Tab>General</Tab>
                    <Tab>Characterizations</Tab>
                    <Tab>Configurations</Tab>
                    <Tab>Constants</Tab>
                </TabList>
                <TabPanel>
                    <div className="panel-flexbox-configuration">
                        <div className="panel-flexbox-item-properties">
                            <DedopCollapse panelTitle="Properties" collapseIcon="pt-icon-document"/>
                            <DedopCollapse panelTitle="General Parameters" collapseIcon="pt-icon-properties"/>
                        </div>
                        <div className="panel-flexbox-item-roi">
                            <DedopCollapse panelTitle="Region of Interest" collapseIcon="pt-icon-properties"/>
                        </div>
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
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
                            <table>
                                <tbody>
                                <ConfigurationSingleEntry configName="freq_ku_chd" defaultValue="13575000000.0"
                                                          unit="Hz"/>
                                <ConfigurationSingleEntry configName="bw_ku_chd" defaultValue="320000000" unit="Hz"/>
                                <ConfigurationSingleEntry configName="pri_sar_chd" defaultValue="5.610000296769016e-05"
                                                          unit="s"/>
                                <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0"
                                                          unit="m"/>
                                </tbody>
                            </table>
                        }
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <DedopConfigCollapse panelTitle="Properties" collapseIcon="pt-icon-document"/>
                        <DedopConfigCollapse panelTitle="Flags" collapseIcon="pt-icon-document"/>
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <table>
                            <tbody>
                            <ConfigurationSingleEntry configName="semi_major_axis_cst" defaultValue="6378137.0"
                                                      unit="m"/>
                            <ConfigurationSingleEntry configName="semi_minor_axis_cst" defaultValue="6356752.3142"
                                                      unit="m"/>
                            <ConfigurationSingleEntry configName="flat_coeff_cst" defaultValue="0.00335281067183084"/>
                            <ConfigurationSingleEntry configName="earth_radius_cst" defaultValue="6378137.0" unit="m"/>
                            </tbody>
                        </table>
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
            </Tabs>
        );
    }
}
