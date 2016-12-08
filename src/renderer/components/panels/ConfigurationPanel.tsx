import * as React from 'react';
import TreeMenu from "../TreeMenu";
import {ConfigurationTabs} from "../Tabs";
import {connect} from "react-redux";
import {updatePanelTitle} from "../../actions";
import {ConfigurationPanelHeader} from "../PanelHeader";

interface IConfigurationPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IConfigurationPanelProps {
    return {};
}

class ConfigurationPanel extends React.Component<IConfigurationPanelProps, any> {
    componentWillMount(){
        this.props.dispatch(updatePanelTitle("Configuration"));
    }

    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item-configurations">
                    <ConfigurationPanelHeader title={"Configuration Names"}/>
                    <TreeMenu/>
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
