import * as React from "react";

export class ConfigurationPanelHeader extends React.Component<any, any> {
    render() {
        return (
            <div className="dedop-collapse-header">
                <span className="dedop-collapse-header-icon pt-icon-standard pt-icon-globe"/>
                <span className="dedop-collapse-header-text">Configurations</span>
                <div className="dedop-panel-header-configurations-buttons">
                    <span className="pt-icon-standard pt-icon-add dedop-panel-header-configurations-button"/>
                    <span className="pt-icon-standard pt-icon-remove dedop-panel-header-configurations-button"/>
                    <span
                        className="pt-icon-standard pt-icon-circle-arrow-up dedop-panel-header-configurations-button"/>
                    <span
                        className="pt-icon-standard pt-icon-circle-arrow-down dedop-panel-header-configurations-button"/>
                </div>
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
