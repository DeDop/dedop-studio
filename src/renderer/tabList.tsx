import * as React from "react";

import {Tab, TabList, TabPanel, Tabs} from "@blueprintjs/core";

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
                    <h3>Example panel: React</h3>
                    <p className="pt-running-text">
                        Lots of people use React as the V in MVC. Since React makes no assumptions about the
                        rest of your technology stack, it's easy to try it out on a small feature in an existing
                        project.
                    </p>
                </TabPanel>
                <TabPanel>
                    <h3>Example panel: Angular</h3>
                    <p className="pt-running-text">
                        HTML is great for declaring static documents, but it falters when we try to use it for
                        declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary
                        for your application. The resulting environment is extraordinarily expressive, readable,
                        and quick to develop.
                    </p>
                </TabPanel>
                <TabPanel>
                    <h3>Example panel: Ember</h3>
                    <p className="pt-running-text">
                        Ember.js is an open-source JavaScript application framework, based on the
                        model-view-controller (MVC) pattern. It allows developers to create scalable single-page
                        web applications by incorporating common idioms and best practices into the framework.
                        What is your favorite JS framework?
                    </p>
                    <input className="pt-input" type="text"/>
                </TabPanel>
                <TabPanel>
                    <h3>Backbone</h3>
                </TabPanel>
            </Tabs>
        );
    }
}
