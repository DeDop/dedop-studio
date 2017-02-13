import * as React from "react";
import {PopoverInteractionKind, Popover, Position, Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import {connect, Dispatch} from "react-redux";
import {State} from "../state";
import {setCurrentWorkspace} from "../actions";

interface IWorkspaceInfoProps {
    dispatch?: Dispatch<State>;
    workspaceName: string;
    workspaceNames: string[];
}

function mapStateToProps(state: State): IWorkspaceInfoProps {
    return {
        workspaceName: state.control.currentWorkspace,
        workspaceNames: state.data.workspaceNames
    }
}

class WorkspaceInfo extends React.Component<IWorkspaceInfoProps, any> {
    public state = {
        editButtonVisible: "hidden",
        isPopoverOpen: false
    };

    render() {
        const handleMouseOver = () => {
            this.setState({
                editButtonVisible: "visible"
            })
        };

        const handleMouseLeave = () => {
            this.setState({
                editButtonVisible: "hidden"
            })
        };

        const handleSelectWorkspace = (workspaceName: string) => {
            this.props.dispatch(setCurrentWorkspace(workspaceName))
        };

        let workspaceItems = [];
        const workspaceNames = this.props.workspaceNames;
        for (let i in workspaceNames) {
            const workspaceName = workspaceNames[i];
            if (this.props.workspaceName != workspaceName)
                workspaceItems.push(<MenuItem key={i}
                                              text={workspaceName}
                                              onClick={() => handleSelectWorkspace(workspaceName)}/>)
        }

        let popoverContent = (
            <Menu>
                <MenuItem
                    iconName="pt-icon-add"
                    text="New workspace"/>
                <MenuItem
                    iconName="pt-icon-exchange"
                    text="Change to...">
                    {workspaceItems}
                </MenuItem>
                <MenuItem
                    iconName="pt-icon-duplicate"
                    text="Copy workspace"/>
                <MenuItem
                    iconName="pt-icon-new-text-box"
                    text="Rename workspace"/>
                <MenuDivider />
                <MenuItem
                    iconName="pt-icon-delete"
                    text="Delete workspace"
                    className="pt-intent-danger"
                />
            </Menu>
        );
        const handleInteraction = () => {
            this.setState({
                isPopoverOpen: !this.state.isPopoverOpen
            })
        };

        return (
            <div className="dedop-workspace-top-menu"
                 onMouseOver={handleMouseOver}
                 onMouseLeave={handleMouseLeave}>
                <span className="dedop-workspace-top-menu-text">{this.props.workspaceName}</span>

                <Popover content={popoverContent}
                         interactionKind={PopoverInteractionKind.CLICK}
                         isOpen={this.state.isPopoverOpen}
                         onInteraction={handleInteraction}
                         position={Position.LEFT_BOTTOM}
                         useSmartPositioning={true}
                >
                    <span className="pt-icon-standard pt-icon-edit dedop-workspace-top-menu-icon"
                          style={{visibility: this.state.editButtonVisible}}/>
                </Popover>
            </div>
        )
    }
}

export default connect(mapStateToProps)(WorkspaceInfo);
