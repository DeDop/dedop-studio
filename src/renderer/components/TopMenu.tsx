import * as React from "react";
import {State} from "../state";
import {connect} from "react-redux";
import {mainTabs} from "../initialStates";
import WorkspaceInfo from "./WorkspaceInfo";

interface ITopMenuProps {
    currentMainTabPanel?: number;
}

function mapStateToProps(state: State): ITopMenuProps {
    return {
        currentMainTabPanel: state.control.currentMainTabPanel,
    };
}

export class TopMenu extends React.Component<ITopMenuProps, any> {
    public render() {
        const panelTitle = " - " + mainTabs[this.props.currentMainTabPanel];
        return (
            <nav className="pt-navbar dedop-top-menu-height">
                <div className="pt-navbar-group pt-align-left dedop-top-menu dedop-top-menu-height">
                    <img src="resources/linux/48x48.png"/>
                    <div className="pt-navbar-heading dedop-menu-title">DeDop Studio{panelTitle}</div>
                    <WorkspaceInfo/>
                </div>
            </nav>
        )
    }
}

export default connect(mapStateToProps)(TopMenu);
