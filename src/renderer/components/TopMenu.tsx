import * as React from "react";
import {State} from "../state";
import {connect} from "react-redux";

interface ITopMenuProps {
    panelTitle: string;
}

function mapStateToProps(state: State): ITopMenuProps {
    return {
        panelTitle: state.control.mainPanelTitle,
    };
}

export class TopMenu extends React.Component<ITopMenuProps, any> {
    public render() {
        const panelTitle = this.props.panelTitle ? " - " + this.props.panelTitle : "";
        return (
            <nav className="pt-navbar .modifier">
                <div className="pt-navbar-group pt-align-left">
                    <img src="resources/dedop-32.png"/>
                    <div className="pt-navbar-heading dedop-menu-title">DeDop Studio{panelTitle}</div>
                </div>
            </nav>
        )
    }
}

export default connect(mapStateToProps)(TopMenu);
