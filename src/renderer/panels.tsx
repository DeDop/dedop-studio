import * as React from "react";
import {CollapseSample} from "./collapse";

export class InputDatasetPanel extends React.Component<any, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item" style={{backgroundColor: "#1F4B99"}}>
                    Left
                </div>
                <div className="panel-flexbox-item" style={{backgroundColor: "#A82A2A"}}>
                    Right
                </div>
            </div>
        )
    }
}

export class ConfigurationPanel extends React.Component<any, any> {
    public render() {
        return (
            <div>
                ConfigurationPanel
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
