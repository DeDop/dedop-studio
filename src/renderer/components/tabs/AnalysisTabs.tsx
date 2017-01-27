import * as React from "react";
import {Tabs, TabList, Tab, TabPanel} from "@blueprintjs/core";
import "codemirror/mode/javascript/javascript";
import MouseEventHandler = React.MouseEventHandler;

interface IAnalysisTabsProps {
}

export class AnalysisTabs extends React.Component<IAnalysisTabsProps,any> {
    constructor(props) {
        super(props);
    }

    public render() {
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
                                <select>
                                    <option selected>Select a configuration...</option>
                                    <option value="1">Alternate Delay-Doppler Processing</option>
                                    <option value="2">Modified Surface Locations</option>
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
