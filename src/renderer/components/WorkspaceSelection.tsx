import * as React from 'react'
import {Configuration, State} from "../state";
import {connect} from "react-redux";

export interface IWorkspaceSelectionProps {
    workspaceNames: string[];
    onChangeSelection: (event: any) => void;
}

function mapStateToProps(state: State, ownProps): IWorkspaceSelectionProps {
    return {
        workspaceNames: state.data.workspaceNames,
        onChangeSelection: ownProps.onChangeSelection
    };
}

class WorkspaceSelection extends React.Component<IWorkspaceSelectionProps,any> {
    public render() {

        let workspaceSelectionItem = [];
        const workspaces = this.props.workspaceNames;
        for (let i in workspaces) {
            workspaceSelectionItem.push(<option key={i}
                                                value={workspaces[i]}
            >
                {workspaces[i]}
            </option>)
        }

        return (
            <div className="pt-select dedop-dialog-parameter-item">
                    <span className="dedop-dialog-parameter-label">
                                Workspaces
                            </span>
                <select className="dedop-dialog-parameter-input" onChange={this.props.onChangeSelection}>
                    {workspaceSelectionItem}
                </select>
            </div>
        )
    }
}

export default connect(mapStateToProps)(WorkspaceSelection)
