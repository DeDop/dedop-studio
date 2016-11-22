import * as React from "react";

import {Table, Column, Cell} from "@blueprintjs/table";
import {CollapseSample} from "./collapse";
import {ConfigurationTabs} from './tabList';
import {PanelHeader} from './panelHeader';
import TreeMenu from './treeMenu';
import {Footprints} from "./footprints";
import {CesiumView} from "./cesium/view";

export class InputDatasetPanel extends React.Component<any, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item" style={{backgroundColor: "#1F4B99"}}>
                    <CollapseSample panelTitle="L1A Datasets"/>
                    <CollapseSample panelTitle="Global Metadata"/>
                </div>
                <div className="panel-flexbox-item" style={{backgroundColor: "#A82A2A"}}>
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
                <h1>Processor Invocation, Control, Observation</h1>
                <div className="flexbox-item-pico-config" style={{backgroundColor: "#1F4B99"}}>
                    Config
                </div>
                <div className="flexbox-item-pico-footprints" style={{backgroundColor: "#A82A2A"}}>
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
