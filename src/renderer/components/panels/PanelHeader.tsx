import * as React from "react";

export interface IPanelHeaderProps {
    title: string;
    icon?: string;
}

export class OrdinaryPanelHeader extends React.Component<IPanelHeaderProps, any> {
    render() {
        const icon = this.props.icon ? this.props.icon : "pt-icon-globe";
        return (
            <div className="dedop-collapse-header">
                <span className={"dedop-collapse-header-icon pt-icon-standard " + icon}/>
                <span className="dedop-collapse-header-text">{this.props.title}</span>
            </div>
        )
    }
}

export class ConfigurationPanelHeader extends React.Component<IPanelHeaderProps, any> {
    render() {
        const icon = this.props.icon ? this.props.icon : "pt-icon-globe";
        return (
            <div className="dedop-collapse-header">
                <span className={"dedop-collapse-header-icon pt-icon-standard " + icon}/>
                <span className="dedop-collapse-header-text">{this.props.title}</span>
            </div>
        )
    }
}

export class FootprintPanelHeader extends React.Component<any, any> {
    render() {
        return (
            <div className="dedop-collapse-header">
                <span className="dedop-collapse-header-icon pt-icon-standard pt-icon-globe"/>
                <span className="dedop-collapse-header-text">Footprints</span>
            </div>
        )
    }
}

export class L1ADatasetsPanelHeader extends React.Component<any, any> {
    render() {
        return (
            <div className="dedop-collapse-header">
                <span className="dedop-collapse-header-icon pt-icon-standard pt-icon-document"/>
                <span className="dedop-collapse-header-text">L1A Datasets</span>
            </div>
        )
    }
}
