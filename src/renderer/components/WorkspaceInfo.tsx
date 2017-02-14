import * as React from "react";
import {
    PopoverInteractionKind,
    Popover,
    Position,
    Menu,
    MenuItem,
    MenuDivider,
    Dialog,
    Button,
    Intent
} from "@blueprintjs/core";
import {connect, Dispatch} from "react-redux";
import {State} from "../state";
import {setCurrentWorkspace, newWorkspace, renameWorkspace} from "../actions";
import WorkspaceSelection from "./WorkspaceSelection";

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
        isPopoverOpen: false,
        isAddWorkspaceDialogOpen: false,
        isRenameWorkspaceDialogOpen: false,
        newWorkspaceName: "",
        workspaceNameValid: true,
        selectedWorkspace: ""
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

        const handleCloseAddWorkspaceDialog = () => {
            this.setState({
                isAddWorkspaceDialogOpen: false
            })
        };

        const handleShowAddWorkspaceDialog = () => {
            this.setState({
                isAddWorkspaceDialogOpen: true
            })
        };

        const handleCloseRenameWorkspaceDialog = () => {
            this.setState({
                isRenameWorkspaceDialogOpen: false
            })
        };

        const handleShowRenameWorkspaceDialog = () => {
            this.setState({
                isRenameWorkspaceDialogOpen: true
            })
        };

        let popoverContent = (
            <Menu>
                <MenuItem
                    iconName="pt-icon-add"
                    text="New workspace"
                    onClick={handleShowAddWorkspaceDialog}
                />
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
                    text="Rename workspace"
                    onClick={handleShowRenameWorkspaceDialog}
                />
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

        const handleWorkspaceNameEdit = (event: any) => {
            const value = event.currentTarget.value;
            this.setState({
                newWorkspaceName: value
            })
        };

        const resetConfigInvalidStatus = () => {
            this.setState({
                workspaceNameValid: true
            })
        };

        const handleAddWorkspace = () => {
            if (this.state.newWorkspaceName) {
                this.props.dispatch(newWorkspace(this.state.newWorkspaceName));
                handleCloseAddWorkspaceDialog();
                this.setState({
                    newWorkspaceName: ""
                })
            } else {
                this.setState({
                    workspaceNameValid: false
                })
            }
        };

        const handleRenameWorkspace = () => {
            if (this.state.newWorkspaceName) {
                this.props.dispatch(renameWorkspace(this.state.selectedWorkspace, this.state.newWorkspaceName));
                handleCloseRenameWorkspaceDialog();
                this.setState({
                    newWorkspaceName: "",
                    selectedWorkspace: ""
                })
            } else {
                this.setState({
                    workspaceNameValid: false,
                    selectedWorkspace: ""
                })
            }
        };

        const handleOnChangeSelection = (event: React.FormEvent<HTMLSelectElement>) => {
            const value = event.currentTarget.value;
            this.setState({
                selectedWorkspace: value
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
                <Dialog isOpen={this.state.isAddWorkspaceDialogOpen}
                        onClose={handleCloseAddWorkspaceDialog}
                        title="Add a new workspace"
                        className="dedop-dialog-body-add-config"
                >
                    <div className="pt-dialog-body">
                        <div className="dedop-dialog-parameter-item">
                            <label className="pt-label pt-inline">
                                <span className="dedop-dialog-parameter-label">Name</span>
                                <input
                                    className={"pt-input pt-inline dedop-dialog-parameter-input ".concat(this.state.workspaceNameValid? "" : "pt-intent-danger")}
                                    type="text"
                                    placeholder="new workspace name"
                                    dir="auto"
                                    value={this.state.newWorkspaceName}
                                    onChange={handleWorkspaceNameEdit}
                                    onFocus={resetConfigInvalidStatus}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button intent={Intent.PRIMARY}
                                    onClick={handleAddWorkspace}
                                    text="Save"/>
                            <Button onClick={handleCloseAddWorkspaceDialog}
                                    text="Cancel"
                            />
                        </div>
                    </div>
                </Dialog>
                <Dialog isOpen={this.state.isRenameWorkspaceDialogOpen}
                        onClose={handleCloseRenameWorkspaceDialog}
                        title="Rename a workspace"
                        className="dedop-dialog-body-add-config"
                >
                    <div className="pt-dialog-body">
                        <WorkspaceSelection onChangeSelection={handleOnChangeSelection}/>
                        <div className="dedop-dialog-parameter-item">
                            <label className="pt-label pt-inline">
                                <span className="dedop-dialog-parameter-label">Name</span>
                                <input
                                    className={"pt-input pt-inline dedop-dialog-parameter-input ".concat(this.state.workspaceNameValid? "" : "pt-intent-danger")}
                                    type="text"
                                    placeholder="new workspace name"
                                    dir="auto"
                                    value={this.state.newWorkspaceName}
                                    onChange={handleWorkspaceNameEdit}
                                    onFocus={resetConfigInvalidStatus}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button intent={Intent.PRIMARY}
                                    onClick={handleRenameWorkspace}
                                    text="Save"/>
                            <Button onClick={handleCloseRenameWorkspaceDialog}
                                    text="Cancel"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default connect(mapStateToProps)(WorkspaceInfo);
