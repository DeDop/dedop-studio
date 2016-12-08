import * as React from "react";

import {DedopCollapse, DedopRunSettingsCollapse, DedopL1aInputCollapse, DedopL1aInputListCollapse} from "./Collapse";
import {ConfigurationTabs} from './Tabs';
import TreeMenu from './TreeMenu';
import {FootprintsPanel} from "./FootprintsPanel";
import {processingItems, dummyInputL1aFiles} from "../initialStates";
import {ProcessingTable} from "./ProcessingTable";
import {OrdinaryPanelHeader} from "./PanelHeader";

export class InputDatasetPanel extends React.Component<any, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item">
                    <DedopL1aInputListCollapse panelTitle="L1A Datasets" collapseIcon="pt-icon-document"
                                               l1aInputFileNames={dummyInputL1aFiles}/>
                    <DedopCollapse panelTitle="Global Metadata" collapseIcon="pt-icon-properties"/>
                </div>
                <div className="panel-flexbox-item">
                    <FootprintsPanel/>
                </div>
            </div>
        )
    }
}

export class ConfigurationPanel extends React.Component<any, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item-configurations">
                    <TreeMenu/>
                </div>
                <div className="panel-flexbox-item">
                    <ConfigurationTabs/>
                </div>
            </div>
        )
    }
}


export class ProcessingPanel extends React.Component<any, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="flexbox-item-pico-config">
                    <DedopRunSettingsCollapse panelTitle="Run Settings" collapseIcon="pt-icon-settings"/>
                    <DedopL1aInputCollapse panelTitle="L1A Input" collapseIcon="pt-icon-properties"/>
                    <button type="button" className="pt-button pt-fill">Run</button>
                </div>
                <div className="flexbox-item-pico-footprints">
                    <FootprintsPanel/>
                </div>
                <div className="flexbox-item-pico-runs">
                    <OrdinaryPanelHeader title="Processor Runs" icon="pt-icon-th-list"/>
                    <ProcessingTable processingItems={processingItems}/>
                </div>
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