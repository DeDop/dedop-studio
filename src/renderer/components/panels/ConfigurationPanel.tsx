import * as React from 'react';
import {ConfigurationTabs} from "../Tabs";
import {connect} from "react-redux";
import {updatePanelTitle, updateConfigSelection} from "../../actions";
import {ConfigurationPanelHeader} from "../PanelHeader";
import {ListBox} from "../ListBox";
import {dummyConfigFileList} from '../../initialStates'
import {State} from "../../state";

interface IConfigurationPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
    selectedConfiguration: string[];
}

function mapStateToProps(state: State): IConfigurationPanelProps {
    return {
        selectedConfiguration: [state.control.selectedConfiguration]
    };
}

class ConfigurationPanel extends React.Component<IConfigurationPanelProps, any> {
    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Configuration"));
    }

    public render() {
        const renderFileList = (itemIndex: number) => {
            const configFile = dummyConfigFileList[itemIndex];
            return (
                <div className="dedop-list-box-item">
                    <span className="dedop-file-name">{configFile.name}</span>
                    <span className="dedop-file-updated-date">{configFile.lastUpdated}</span>
                </div>
            )
        };

        const handleSelectConfig = (oldSelection: Array<React.Key>, newSelection: Array<React.Key>) => {
            this.props.dispatch(updateConfigSelection(newSelection[0].toString()));
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
