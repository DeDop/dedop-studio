import * as React from "react";
import {PopoverInteractionKind, Popover, Position, Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import {connect} from "react-redux";
import {State} from "../state";

interface IWorkspaceInfoProps {
    workspaceName: string;
}

function mapStateToProps(state: State): IWorkspaceInfoProps {
    return {
        workspaceName: state.control.currentWorkspace
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
        let popoverContent = (
            <Menu>
                <MenuItem
                    iconName="pt-icon-add"
                    text="New workspace"/>
                <MenuItem
                    iconName="pt-icon-exchange"
                    text="Change to..."/>
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
