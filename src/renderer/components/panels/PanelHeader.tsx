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
