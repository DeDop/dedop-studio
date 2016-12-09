import * as React from 'react';
import ConfigurationTabs from "../ConfigurationTabs";
import {connect} from "react-redux";
import {
    updatePanelTitle, updateConfigSelection, selectCurrentConfig, deleteConfigName,
    addConfigName
} from "../../actions";
import {ConfigurationPanelHeader, OrdinaryPanelHeader} from "../PanelHeader";
import {ListBox} from "../ListBox";
import {State, ConfigurationFile} from "../../state";
import {EditableText} from "@blueprintjs/core";

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
    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Configuration"));
    }

    public render() {
        const renderFileList = (itemIndex: number) => {
            const configFile = this.props.configurations[itemIndex];
            const isCurrent = configFile.name == this.props.currentConfiguration;
            const handleDeleteConfig = (itemIndex: number) => {
                this.props.dispatch(deleteConfigName(itemIndex));
            };
            return (
                <div className="dedop-list-box-item" style={isCurrent? {fontWeight: "bold"} : {}}>
                    <span className="dedop-file-name">{configFile.name}</span>
                    <span className="pt-tag pt-intent-success dedop-file-current-tag"
                          style={isCurrent ? {visibility: "visible"} : {visibility: "hidden"}}>current</span>
                    <span className="dedop-file-updated-date">{configFile.lastUpdated}</span>
                    <span className="pt-icon-standard pt-icon-delete dedop-file-delete"
                          onClick={handleDeleteConfig.bind(this, itemIndex)}/>
                </div>
            )
        };

        const handleSelectConfig = (oldSelection: Array<React.Key>, newSelection: Array<React.Key>) => {
            this.props.dispatch(updateConfigSelection(newSelection.length > 0 ? newSelection[0] as string : null));
        };

        const handleCurrentConfig = (key: React.Key) => {
            this.props.dispatch(selectCurrentConfig(key as string));
        };

        const handleAddConfig = (value: string) => {
            this.props.dispatch(addConfigName(value));
        };

        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item-configurations">
                    <ConfigurationPanelHeader title="Configuration Names"/>
                    <EditableText placeholder="add new configuration" onConfirm={handleAddConfig}
                                  className="dedop-config-add-editable"/>
                    <ListBox numItems={this.props.configurations.length}
                             getItemKey={index => this.props.configurations[index].name}
                             renderItem={renderFileList}
                             selection={this.props.selectedConfiguration ? this.props.selectedConfiguration : []}
                             onSelection={handleSelectConfig}
                             onItemDoubleClick={handleCurrentConfig}
                    />
                </div>
                <div className="panel-flexbox-item">
                    <OrdinaryPanelHeader title="Configuration Details"/>
                    <ConfigurationTabs/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ConfigurationPanel);
