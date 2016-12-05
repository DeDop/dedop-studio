import * as React from "react";

import {Tab, TabList, TabPanel, Tabs, InputGroup, Tag, Classes} from "@blueprintjs/core";
import {InputDatasetPanel, ConfigurationPanel, ProcessingPanel, ResultPanel} from './panels'
import {DedopCollapse} from "./collapse";
import {ConfigurationSingleEntry} from "./configurationSingleEntry";

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
    public render() {
        const unitHz = (
            <Tag className={Classes.MINIMAL}>Hz</Tag>
        );
        const unitSecond = (
            <Tag className={Classes.MINIMAL}>s</Tag>
        );
        const unitMeter = (
            <Tag className={Classes.MINIMAL}>m</Tag>
        );
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
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <table>
                            <ConfigurationSingleEntry configName="freq_ku_chd" defaultValue="13575000000.0" unit="Hz"/>
                            <ConfigurationSingleEntry configName="bw_ku_chd" defaultValue="320000000" unit="Hz"/>
                            <ConfigurationSingleEntry configName="pri_sar_chd" defaultValue="5.610000296769016e-05" unit="s"/>
                            <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <label className="pt-label pt-inline">
                            freq_ku_chd
                            <InputGroup className="config-textbox" placeholder="13575000000.0" rightElement={unitHz}/>
                        </label>
                        <label className="pt-label pt-inline">
                            bw_ku_chd
                            <InputGroup className="config-textbox" placeholder="320000000" rightElement={unitHz}/>
                        </label>
                        <label className="pt-label pt-inline">
                            pri_sar_chd
                            <InputGroup className="config-textbox" placeholder="5.610000296769016e-05"
                                        rightElement={unitSecond}/>
                        </label>
                        <label className="pt-label pt-inline">
                            mean_sat_alt_chd
                            <InputGroup className="config-textbox" placeholder="1347000.0" rightElement={unitMeter}/>
                        </label>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <table>
                            <ConfigurationSingleEntry configName="semi_major_axis_cst" defaultValue="6378137.0" unit="m"/>
                            <ConfigurationSingleEntry configName="semi_minor_axis_cst" defaultValue="6356752.3142" unit="m"/>
                            <ConfigurationSingleEntry configName="flat_coeff_cst" defaultValue="0.00335281067183084"/>
                            <ConfigurationSingleEntry configName="earth_radius_cst" defaultValue="6378137.0" unit="m"/>
                        </table>
                    </div>
                </TabPanel>
            </Tabs>
        );
    }
}
