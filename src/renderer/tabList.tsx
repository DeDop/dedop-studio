import * as React from "react";

import {Tab, TabList, TabPanel, Tabs} from "@blueprintjs/core";
import {InputDatasetPanel, ConfigurationPanel, ProcessingPanel, ResultPanel} from './panels'
import {Footprints} from "./footprints";

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
                    TEST1
                </TabPanel>
                <TabPanel>
                    TEST2
                </TabPanel>
                <TabPanel>
                    TEST3
                </TabPanel>
                <TabPanel>
                    TEST4
                </TabPanel>
            </Tabs>
        );
    }
}
