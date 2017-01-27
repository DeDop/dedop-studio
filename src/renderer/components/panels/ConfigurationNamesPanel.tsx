import * as React from "react";
import {ConfigurationPanelHeader} from "./PanelHeader";
import {ListBox} from "../ListBox";
import {
    deleteConfigName,
    updateConfigSelection,
    selectCurrentConfig,
    addConfigName,
    updateConfigName
} from "../../actions";
import {Configuration, State} from "../../state";
import {connect} from "react-redux";
import {Alert, Button, Intent, Dialog} from "@blueprintjs/core";
import ConfigurationSelection from "../ConfigurationSelection";

interface IConfigurationNamesPanelProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    selectedConfiguration: string[];
    currentConfiguration: string;
    configurations: Configuration[];
}

function mapStateToProps(state: State): IConfigurationNamesPanelProps {
    return {
        selectedConfiguration: [state.control.selectedConfiguration],
        currentConfiguration: state.control.currentConfiguration,
        configurations: state.data.configurations
    }
}

class ConfigurationNamesPanel extends React.Component<any, any> {
    public state = {
        isNotImplementedAlertOpen: false,
        isFileNotSelectedAlertOpen: false,
        isAddConfigDialogOpen: false,
        isRenameConfigDialogOpen: false,
        newConfigName: "",
        baseConfigName: "default",
        configNameValid: true
    };

    render() {
        const handleOpenAddConfigDialog = () => {
            this.setState({
                isAddConfigDialogOpen: true
            })
        };

        const handleOpenRenameConfigDialog = () => {
            if (this.props.selectedConfiguration[0]) {
                this.setState({
                    isRenameConfigDialogOpen: true
                })
            } else {
                this.setState({
                    isFileNotSelectedAlertOpen: true
                })
            }
        };

        const handleDeleteConfig = () => {
            if (this.props.selectedConfiguration[0]) {
                this.props.dispatch(deleteConfigName(this.props.selectedConfiguration[0]));
            } else {
                this.setState({
                    isFileNotSelectedAlertOpen: true
                })
            }
        };

        const renderFileList = (itemIndex: number) => {
            const configFile = this.props.configurations[itemIndex];
            const isCurrent = configFile.name == this.props.currentConfiguration;
            return (
                <div className="dedop-list-box-item" style={isCurrent? {fontWeight: "bold"} : {}}>
                    <span className="dedop-file-name">{configFile.name}</span>
                    <span className="pt-tag pt-intent-success dedop-file-current-tag"
                          style={isCurrent ? {visibility: "visible"} : {visibility: "hidden"}}>current</span>
                    <span className="dedop-file-updated-date">{configFile.lastUpdated}</span>
                </div>
            )
        };

        const handleSelectConfig = (oldSelection: Array<React.Key>, newSelection: Array<React.Key>) => {
            this.props.dispatch(updateConfigSelection(newSelection.length > 0 ? newSelection[0] as string : null));
        };

        const handleCurrentConfig = (key: React.Key) => {
            this.props.dispatch(selectCurrentConfig(key as string));
        };

        const handleCloseAddConfigDialog = () => {
            this.setState({
                isAddConfigDialogOpen: false
            })
        };

        const handleCloseRenameConfigDialog = () => {
            this.setState({
                isRenameConfigDialogOpen: false
            })
        };

        const handleRenameConfig = () => {
            if (this.state.newConfigName) {
                this.props.dispatch(updateConfigName(this.props.selectedConfiguration[0], this.state.newConfigName, this.props.currentConfiguration));
                handleCloseRenameConfigDialog();
                this.setState({
                    newConfigName: ""
                })
            } else {
                this.setState({
                    configNameValid: false
                })
            }
        };

        const handleCloseAlert = () => {
            this.setState({
                isNotImplementedAlertOpen: false,
                isFileNotSelectedAlertOpen: false,
            })
        };

        const handleAddConfig = () => {
            if (this.state.newConfigName) {
                this.props.dispatch(addConfigName(this.state.newConfigName, this.state.baseConfigName));
                handleCloseAddConfigDialog();
                this.setState({
                    newConfigName: ""
                })
            } else {
                this.setState({
                    configNameValid: false
                })
            }
        };

        const handleConfigNameEdit = (event: any) => {
            const value = event.currentTarget.value;
            this.setState({
                newConfigName: value
            })
        };

        const handleOnChangeSelection = (event: React.FormEvent<HTMLSelectElement>) => {
            const value = event.currentTarget.value;
            this.setState({
                baseConfigName: value
            })
        };

        const resetConfigInvalidStatus = () => {
            this.setState({
                configNameValid: true
            })
        };

        return (
            <div className="panel-flexbox-item-configurations">
                <ConfigurationPanelHeader title="Configuration Names" icon="pt-icon-properties"/>
                <div className="configuration-file-buttons">
                    <button
                        className="pt-button pt-intent-primary pt-icon-standard pt-icon-add configuration-file-button"
                        onClick={handleOpenAddConfigDialog}
                    >
                        Add
                    </button>
                    <button className="pt-button configuration-file-button"
                            onClick={handleOpenRenameConfigDialog}>
                        Rename
                    </button>
                    <button className="pt-button configuration-file-button"
                            onClick={handleDeleteConfig}>
                        Remove
                    </button>
                </div>
                <ListBox numItems={this.props.configurations.length}
                         getItemKey={index => this.props.configurations[index].name}
                         renderItem={renderFileList}
                         selection={this.props.selectedConfiguration ? this.props.selectedConfiguration : []}
                         onSelection={handleSelectConfig}
                         onItemDoubleClick={handleCurrentConfig}
                />
                <Alert
                    isOpen={this.state.isNotImplementedAlertOpen}
                    onConfirm={handleCloseAlert}
                    className='dedop-alert-not-implemented'
                    iconName='pt-icon-build'
                >
                    Not yet implemented
                </Alert>
                <Alert
                    isOpen={this.state.isFileNotSelectedAlertOpen}
                    onConfirm={handleCloseAlert}
                    className="dedop-alert-warning"
                    iconName="pt-icon-warning-sign"
                >
                    A configuration file must be selected
                </Alert>
                <Dialog isOpen={this.state.isAddConfigDialogOpen}
                        onClose={handleCloseAddConfigDialog}
                        title="Add a new configuration file"
                        className="dedop-dialog-body-add-config"
                >
                    <div className="pt-dialog-body">
                        <div className="dedop-dialog-parameter-item">
                            <label className="pt-label pt-inline">
                                <span className="dedop-dialog-parameter-label">Name</span>
                                <input
                                    className={"pt-input pt-inline dedop-dialog-parameter-input ".concat(this.state.configNameValid? "" : "pt-intent-danger")}
                                    type="text"
                                    placeholder="configuration name"
                                    dir="auto"
                                    value={this.state.newConfigName}
                                    onChange={handleConfigNameEdit}
                                    onFocus={resetConfigInvalidStatus}
                                />
                            </label>
                        </div>
                        <ConfigurationSelection onChangeSelection={handleOnChangeSelection}/>

                    </div>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button intent={Intent.PRIMARY}
                                    onClick={handleAddConfig}
                                    text="Save"/>
                            <Button onClick={handleCloseAddConfigDialog}
                                    text="Cancel"
                            />
                        </div>
                    </div>
                </Dialog>
                <Dialog isOpen={this.state.isRenameConfigDialogOpen}
                        onClose={handleCloseRenameConfigDialog}
                        title="Rename configuration file"
                        className="dedop-dialog-body-add-config"
                >
                    <div className="pt-dialog-body">
                        <div className="dedop-dialog-parameter-item">
                            <label className="pt-label pt-inline">
                                <span className="dedop-dialog-parameter-label">New name</span>
                                <input
                                    className={"pt-input pt-inline dedop-dialog-parameter-input ".concat(this.state.configNameValid? "" : "pt-intent-danger")}
                                    type="text"
                                    placeholder="configuration name"
                                    dir="auto"
                                    value={this.state.newConfigName}
                                    onChange={handleConfigNameEdit}
                                    onFocus={resetConfigInvalidStatus}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button intent={Intent.PRIMARY}
                                    onClick={handleRenameConfig}
                                    text="Save"/>
                            <Button onClick={handleCloseRenameConfigDialog}
                                    text="Cancel"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ConfigurationNamesPanel);
