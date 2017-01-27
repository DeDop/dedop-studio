import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import ConfigurationTabs from "../ConfigurationTabs";

export class ConfigurationDetailsPanel extends React.Component<any,any> {
    render() {
        return (
            <div className="panel-flexbox-item">
                <OrdinaryPanelHeader title="Configuration Details" icon="pt-icon-properties"/>
                <ConfigurationTabs/>
            </div>
        )
    }
}
