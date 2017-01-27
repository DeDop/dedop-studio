import * as React from "react";
import {State} from "../state";
import {connect} from "react-redux";
import {mainTabs} from "../initialStates";
import {updateMainTab} from "../actions";

interface IWorkflowBreadcrumbProps {
    dispatch?: (action: {type: string, payload: number}) => void;
    currentMainTabPanel: number;
    tabNames: string[];
}

function mapStateToProps(state: State) {
    return {
        currentMainTabPanel: state.control.currentMainTabPanel,
        tabNames: mainTabs
    }
}

class WorkflowBreadcrumb extends React.Component<IWorkflowBreadcrumbProps,any> {
    public render() {
        let items = [];
        for (let i in this.props.tabNames) {
            const currentTabStyle = Number(i) == this.props.currentMainTabPanel ? "pt-breadcrumb-current" : "";
            const handleClickBreadcrumb = () => {
                this.props.dispatch(updateMainTab(Number(i)));
            };
            items.push(
                <li key={i}>
                    <span className={"pt-breadcrumb ".concat(currentTabStyle)} onClick={handleClickBreadcrumb}>
                        {this.props.tabNames[i]}
                    </span>
                </li>);
        }
        return (
            <div className="dedop-breadcrumb">
                <ul className="pt-breadcrumbs">
                    {items}
                </ul>
            </div>
        )
    }
}

export default connect(mapStateToProps)(WorkflowBreadcrumb);
