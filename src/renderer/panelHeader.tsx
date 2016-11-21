import * as React from "react";

interface IPanelHeaderProps {
    title: string;
}

export class PanelHeader extends React.Component<IPanelHeaderProps, any> {
    render() {
        return (
            <div>
                {this.props.title}
                <span className="pt-icon-standard pt-icon-add"/>
                <span className="pt-icon-standard pt-icon-remove"/>
                <span className="pt-icon-standard pt-icon-circle-arrow-up"/>
                <span className="pt-icon-standard pt-icon-circle-arrow-down"/>
            </div>
        )
    }
}
