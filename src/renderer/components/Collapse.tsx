import * as React from "react";
import {Collapse, Radio} from "@blueprintjs/core";

export interface ICollapseState {
    isOpen?: boolean;
}

interface IPanelProps {
    panelTitle: string;
    collapseIcon?: string;
}

export class DedopRunSettingsCollapse extends React.Component<IPanelProps, ICollapseState> {
    public state = {
        isOpen: true,
    };

    public render() {
        return (
            <div className="dedop-collapse vertical-third">
                <div className="dedop-collapse-header">
                    <span className={"dedop-collapse-header-icon pt-icon-standard " + this.props.collapseIcon}/>
                    <span className="dedop-collapse-header-text">{this.props.panelTitle}</span>
                    <span className="dedop-collapse-header-actions">
                    {this.state.isOpen ?
                        <span className="pt-icon-standard pt-icon-chevron-up dedop-collapse-header-actions-icon"
                              onClick={this.handleClick}/> :
                        <span className="pt-icon-standard pt-icon-chevron-down dedop-collapse-header-actions-icon"
                              onClick={this.handleClick}/>}
                    </span>
                </div>
                < Collapse isOpen={this.state.isOpen}>
                    <div className="dedop-panel-content">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    Name
                                </td>
                                <td style={{width: '100%'}}>
                                    <input className="pt-input pt-fill" type="text" placeholder="Process name"
                                           dir="auto"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Configuration
                                </td>
                                <td style={{width: '100%'}}>
                                    <div className="pt-select pt-fill">
                                        <select>
                                            <option selected>Select a configuration...</option>
                                            <option value="1">Alternate Delay-Doppler Processing</option>
                                            <option value="2">Modified Surface Locations</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
}

export class DedopRunOutputCollapse extends React.Component<IPanelProps, ICollapseState> {
    public state = {
        isOpen: true,
    };

    public render() {
        return (
            <div className="dedop-collapse vertical-third">
                <div className="dedop-collapse-header">
                    <span className={"dedop-collapse-header-icon pt-icon-standard " + this.props.collapseIcon}/>
                    <span className="dedop-collapse-header-text">{this.props.panelTitle}</span>
                    <span className="dedop-collapse-header-actions">
                    {this.state.isOpen ?
                        <span className="pt-icon-standard pt-icon-chevron-up dedop-collapse-header-actions-icon"
                              onClick={this.handleClick}/> :
                        <span className="pt-icon-standard pt-icon-chevron-down dedop-collapse-header-actions-icon"
                              onClick={this.handleClick}/>}
                    </span>
                </div>
                < Collapse isOpen={this.state.isOpen}>
                    <div className="dedop-panel-content">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    Output directory
                                </td>
                                <td style={{width: '100%'}}>
                                    <label className="pt-file-upload pt-fill l1a-input-file-upload">
                                        <input type="file"/>
                                        <span className="pt-file-upload-input">
                                            Choose directory...
                                        </span>
                                    </label>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
}

interface IL1aInputCollapseState {
    isOpen?: boolean;
    sourceType: string;
}

export class DedopL1aInputCollapse extends React.Component<IPanelProps, IL1aInputCollapseState> {

    constructor() {
        super();
        this.state = {
            isOpen: true,
            sourceType: "single"
        };
        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange() {
        this.setState({
            isOpen: this.state.isOpen,
            sourceType: this.state.sourceType === "single" ? "directory" : "single"
        })
    }

    public render() {
        return (
            <div className="dedop-collapse vertical-third">
                <div className="dedop-collapse-header">
                    <span className={"dedop-collapse-header-icon pt-icon-standard " + this.props.collapseIcon}/>
                    <span className="dedop-collapse-header-text">{this.props.panelTitle}</span>
                    <span className="dedop-collapse-header-actions">
                    {this.state.isOpen ?
                        <span className="pt-icon-standard pt-icon-chevron-up dedop-collapse-header-actions-icon"
                              onClick={this.handleClick}/> :
                        <span className="pt-icon-standard pt-icon-chevron-down dedop-collapse-header-actions-icon"
                              onClick={this.handleClick}/>}
                    </span>
                </div>
                < Collapse isOpen={this.state.isOpen} className="l1a-input-radio-group">
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <Radio label="Single file" value="single" checked={this.state.sourceType == "single"}
                                       onChange={this.handleChange}/>
                            </td>
                            <td style={{width: '100%'}}>
                                <div className="pt-select pt-fill">
                                    <select disabled={this.state.sourceType == "directory"}>
                                        <option selected>Select a configuration...</option>
                                        <option value="1">Alternate Delay-Doppler Processing</option>
                                        <option value="2">Modified Surface Locations</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Radio label="Directory" value="directory"
                                       checked={this.state.sourceType == "directory"}
                                       onChange={this.handleChange}/>
                            </td>
                            <td style={{width: '100%'}}>
                                <label className="pt-file-upload pt-fill l1a-input-file-upload">
                                    <input type="file" disabled={this.state.sourceType == "single"}/>
                                    <span
                                        className="pt-file-upload-input">Choose directory...</span>
                                </label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            sourceType: this.state.sourceType
        });
    }
}
