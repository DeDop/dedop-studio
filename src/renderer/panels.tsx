import * as React from "react";
import {CollapseSample} from "./collapse";
import {ConfigurationTabs} from './tabList';
import {PanelHeader} from './panelHeader';
import TreeMenu from './treeMenu';

export class InputDatasetPanel extends React.Component<any, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item" style={{backgroundColor: "#1F4B99"}}>
                    <CollapseSample panelTitle="L1A Datasets"/>
                    <CollapseSample panelTitle="Global Metadata"/>
                </div>
                <div className="panel-flexbox-item" style={{backgroundColor: "#A82A2A"}}>
                    <CollapseSample panelTitle="Footprints"/>
                </div>
            </div>
        )
    }
}

export class ConfigurationPanel extends React.Component<any, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item" style={{backgroundColor: "#1F4B99"}}>
                    <TreeMenu/>
                </div>
                <div className="panel-flexbox-item" style={{backgroundColor: "#A82A2A"}}>
                    <ConfigurationTabs/>
                </div>
            </div>
        )
    }
}

export class ProcessingPanel extends React.Component<any, any> {
    public render() {
        return (
            <div>
                ProcessingPanel
            </div>
        )
    }
}

export class ResultPanel extends React.Component<any, any> {
    public render() {
        return (
            <div>
                ResultPanel
            </div>
        )
    }
}
