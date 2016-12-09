import * as React from "react";

import {Tab, TabList, TabPanel, Tabs} from "@blueprintjs/core";
import InputDatasetPanel from './panels/InputDatasetPanel';
import ConfigurationPanel from './panels/ConfigurationPanel';
import ProcessingPanel from './panels/ProcessingPanel';
import ResultPanel from './panels/ResultPanel';

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
