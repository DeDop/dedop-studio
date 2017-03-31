import * as React from "react";

import {Tab, TabList, TabPanel, Tabs} from "@blueprintjs/core";
import SourcePanel from '../tabpanels/SourceDataPanel';
import ConfigurationPanel from '../tabpanels/ConfigurationPanel';
import ProcessingPanel from '../tabpanels/ProcessingPanel';
import ResultPanel from '../tabpanels/ResultPanel';
import {connect} from "react-redux";
import {State} from "../../state";
import {updateMainTab} from "../../actions";

interface IMainTabsProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    currentMainTabPanel: number;
}

function mapStateToProps(state: State) {
    return {
        currentMainTabPanel: state.control.currentMainTabPanel
    }
}

class MainTabs extends React.Component<IMainTabsProps,any> {
    public render() {
        const handleChangeTab = (selectedTabIndex: number) => {
            this.props.dispatch(updateMainTab(selectedTabIndex));
        };

        return (
            <Tabs
                className="pt-vertical"
                key="vertical"
                onChange={handleChangeTab}
                selectedTabIndex={this.props.currentMainTabPanel ? this.props.currentMainTabPanel : 0}
            >
                <TabList className="pt-large">
                    <Tab><span className="pt-icon-large pt-icon-database"/></Tab>
                    <Tab><span className="pt-icon-large pt-icon-properties"/></Tab>
                    <Tab><span className="pt-icon-large pt-icon-cog"/></Tab>
                    <Tab><span className="pt-icon-large pt-icon-timeline-bar-chart"/></Tab>
                </TabList>
                <TabPanel>
                    <SourcePanel/>
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

export default connect(mapStateToProps)(MainTabs);
