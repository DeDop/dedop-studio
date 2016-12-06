import * as React from "react";

import {Table, Column, Cell} from "@blueprintjs/table";
import {DedopCollapse, DedopRunSettingsCollapse, DedopL1aInputCollapse} from "./collapse";
import {ConfigurationTabs} from './tabList';
import TreeMenu from './treeMenu';
import {Footprints} from "./footprints";

export class InputDatasetPanel extends React.Component<any, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item">
                    <DedopCollapse panelTitle="L1A Datasets" collapseIcon="pt-icon-document"/>
                    <DedopCollapse panelTitle="Global Metadata" collapseIcon="pt-icon-properties"/>
                </div>
                <div className="panel-flexbox-item">
                    <Footprints/>
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
        const runCell = (rowIndex: number) => {
            return <Cell>{`Task ${(rowIndex)}`}</Cell>
        };
        const configCell = (rowIndex: number) => {
            return <Cell>{`Config ${(rowIndex)}`}</Cell>
        };
        const startedCell = () => {
            return <Cell>11-11-2016</Cell>
        };
        const status = ["Done", "Done", "Failed", "Done", "In progress", "Queued"];
        const statusCell = (rowIndex: number) => {
            return <Cell>{status[rowIndex]}</Cell>
        };
        const processingTime = ["2:54", "1:11", "0:05", "1:30", "", ""];
        const processingTimeCell = (rowIndex: number) => {
            return <Cell>{processingTime[rowIndex]}</Cell>
        };
        const actionButtons = [<span className="pt-icon-standard pt-icon-folder-open"/>,
            <span className="pt-icon-standard pt-icon-folder-open"/>,
            <span className="pt-icon-standard pt-icon-warning-sign"/>,
            <span className="pt-icon-standard pt-icon-folder-open"/>,
            "",
            ""];
        const actionCell = (rowIndex: number) => {
            return <Cell>{actionButtons[rowIndex]}</Cell>
        };
        return (
            <div className="panel-flexbox">
                <div className="flexbox-item-pico-header">Processor Invocation, Control, Observation</div>
                <div className="flexbox-item-pico-config">
                    <DedopRunSettingsCollapse panelTitle="Run Settings" collapseIcon="pt-icon-settings"/>
                    <DedopL1aInputCollapse panelTitle="L1A Input" collapseIcon="pt-icon-properties"/>
                    <button type="button" className="pt-button pt-fill">Run</button>
                </div>
                <div className="flexbox-item-pico-footprints">
                    <Footprints/>
                </div>
                <div className="flexbox-item-pico-runs" style={{backgroundColor: "#1D7324"}}>
                    <Table numRows={6}>
                        <Column name="Run" renderCell={runCell}/>
                        <Column name="Configuration" renderCell={configCell}/>
                        <Column name="Started" renderCell={startedCell}/>
                        <Column name="Status" renderCell={statusCell}/>
                        <Column name="Processing Time" renderCell={processingTimeCell}/>
                        <Column name="Action" renderCell={actionCell}/>
                    </Table>
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
