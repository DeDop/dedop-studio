import * as React from "react";
import {State, Workspace} from "../state";
import {connect} from "react-redux";

export interface IWorkspaceSelectionProps {
    workspaces: Workspace[];
    onChangeSelection: (event: any) => void;
}

function mapStateToProps(state: State, ownProps): IWorkspaceSelectionProps {
    return {
        workspaces: state.data.workspaces,
        onChangeSelection: ownProps.onChangeSelection
    };
}

class WorkspaceSelection extends React.Component<IWorkspaceSelectionProps,any> {
    public render() {

        let workspaceSelectionItem = [];
        const workspaces = this.props.workspaces;
        for (let i in workspaces) {
            workspaceSelectionItem.push(<option key={i}
                                                value={workspaces[i].name}
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
