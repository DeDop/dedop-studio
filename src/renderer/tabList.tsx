import * as React from "react";

import {Tab, TabList, TabPanel, Tabs} from "@blueprintjs/core";
import {CollapseSample} from "./collapse";
import {InputDatasetPanel, ConfigurationPanel, ProcessingPanel, ResultPanel} from './panels'

export default class TabsExample extends React.Component<any,any> {
    public render() {
        return (
            <Tabs
                className="pt-vertical"
                key="vertical"
            >
                <TabList>
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
