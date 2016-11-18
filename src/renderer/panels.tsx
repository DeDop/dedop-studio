import * as React from "react";
import {CollapseSample} from "./collapse";

export class InputDatasetPanel extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <h3>Input Dataset</h3>
                <CollapseSample/>
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
