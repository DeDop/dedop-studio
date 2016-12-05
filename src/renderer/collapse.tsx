import * as React from "react";
import {Button, Collapse} from "@blueprintjs/core";
import {ConfigurationSingleEntry} from "./configurationSingleEntry";

export interface ICollapseState {
    isOpen?: boolean;
}

interface IPanelProps {
    panelTitle: string;
    collapseIcon?: string;
}

export class DedopCollapse extends React.Component<IPanelProps, ICollapseState> {
    public state = {
        isOpen: true,
    };

    public render() {
        return (
            <div className="dedop-collapse">
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
                    <pre>
                        [11:53:30] Finished 'typescript-bundle-blueprint' after 769 ms<br/>
                        [11:53:30] Starting 'typescript-typings-blueprint'...<br/>
                        [11:53:30] Finished 'typescript-typings-blueprint' after 198 ms<br/>
                        [11:53:30] write ./blueprint.css<br/>
                        [11:53:30] Finished 'sass-compile-blueprint' after 2.84 s<br/>
                    </pre>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
}

interface IConfigProps {
    panelTitle: string;
    collapseIcon?: string;
}

export class DedopConfigCollapse extends React.Component<IConfigProps, ICollapseState> {
    public state = {
        isOpen: true,
    };

    public render() {
        return (
            <div className="dedop-collapse">
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
                    <table>
                        <tbody>
                        <ConfigurationSingleEntry configName="freq_ku_chd" defaultValue="13575000000.0" unit="Hz"/>
                        <ConfigurationSingleEntry configName="bw_ku_chd" defaultValue="320000000" unit="Hz"/>
                        <ConfigurationSingleEntry configName="pri_sar_chd" defaultValue="5.610000296769016e-05"
                                                  unit="s"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0" unit="m"/>
                        </tbody>
                    </table>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
}
