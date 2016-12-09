import * as React from 'react';
import ConfigurationTabs from "../ConfigurationTabs";
import {connect} from "react-redux";
import {updatePanelTitle, updateConfigSelection, selectCurrentConfig} from "../../actions";
import {ConfigurationPanelHeader} from "../PanelHeader";
import {ListBox} from "../ListBox";
import {dummyConfigFileList} from '../../initialStates'
import {State} from "../../state";

interface IConfigurationPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
    selectedConfiguration: string[];
    currentConfiguration: string;
}

function mapStateToProps(state: State): IConfigurationPanelProps {
    return {
        selectedConfiguration: [state.control.selectedConfiguration],
        currentConfiguration: state.control.currentConfiguration
    };
}

class ConfigurationPanel extends React.Component<IConfigurationPanelProps, any> {
    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Configuration"));
    }

    public render() {
        const renderFileList = (itemIndex: number) => {
            const configFile = dummyConfigFileList[itemIndex];
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
            this.props.dispatch(updateConfigSelection(newSelection[0].toString()));
        };

        const handleCurrentConfig = (key: React.Key) => {
            this.props.dispatch(selectCurrentConfig(key.toString()));
        };

        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item-configurations">
                    <ConfigurationPanelHeader title={"Configuration Names"}/>
                    <ListBox numItems={dummyConfigFileList.length}
                             renderItem={renderFileList}
                             getItemKey={index => dummyConfigFileList[index].name}
                             selection={this.props.selectedConfiguration ? this.props.selectedConfiguration : []}
                             onSelection={handleSelectConfig}
                             onItemDoubleClick={handleCurrentConfig}
                    />
                </div>
                <div className="panel-flexbox-item">
                    <ConfigurationPanelHeader title={"Configuration Details"}/>
                    <ConfigurationTabs/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ConfigurationPanel);
