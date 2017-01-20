import * as React from 'react';
import ConfigurationTabs from "../ConfigurationTabs";
import {connect} from "react-redux";
import {
    updatePanelTitle, updateConfigSelection, selectCurrentConfig, deleteConfigName,
    addConfigName
} from "../../actions";
import {ConfigurationPanelHeader, OrdinaryPanelHeader} from "./PanelHeader";
import {ListBox} from "../ListBox";
import {State, ConfigurationFile} from "../../state";
import {Alert} from "@blueprintjs/core";
import {isOpen} from "@blueprintjs/core/dist/components/context-menu/contextMenu";

interface IConfigurationPanelProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    selectedConfiguration: string[];
    currentConfiguration: string;
    configurations: ConfigurationFile[];
}

function mapStateToProps(state: State): IConfigurationPanelProps {
    return {
        selectedConfiguration: [state.control.selectedConfiguration],
        currentConfiguration: state.control.currentConfiguration,
        configurations: state.data.configurations
    };
}

class ConfigurationPanel extends React.Component<IConfigurationPanelProps, any> {
    public state = {
        isNotImplementedAlertOpen: false,
        isFileNotSelectedAlertOpen: false
    };

    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Configuration"));
    }

    public render() {
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

        const handleAddConfig = () => {
            this.props.dispatch(addConfigName("new"));
        };

        const handleRenameConfig = () => {
            this.setState({
                isNotImplementedAlertOpen: true
            })
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

        const handleCloseAlert = () => {
            this.setState({
                isNotImplementedAlertOpen: false,
                isFileNotSelectedAlertOpen: false
            })
        };

        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item-configurations">
                    <ConfigurationPanelHeader title="Configuration Names" icon="pt-icon-properties"/>
                    <div className="configuration-file-buttons">
                        <button className="pt-button pt-intent-primary configuration-file-button"
                                onClick={handleAddConfig}>
                            Add
                        </button>
                        <button className="pt-button configuration-file-button"
                                onClick={handleRenameConfig}>
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
                </div>
                <div className="panel-flexbox-item">
                    <OrdinaryPanelHeader title="Configuration Details" icon="pt-icon-properties"/>
                    <ConfigurationTabs/>
                </div>
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
            </div>
        )
    }
}

export default connect(mapStateToProps)(ConfigurationPanel);
