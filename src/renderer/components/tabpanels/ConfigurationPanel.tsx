import * as React from "react";
import {connect} from "react-redux";
import {updatePanelTitle} from "../../actions";
import {Configuration} from "../../state";
import ConfigurationNamesPanel from "../panels/ConfigurationNamesPanel";
import {ConfigurationDetailsPanel} from "../panels/ConfigurationDetailsPanel";
import FormEventHandler = React.FormEventHandler;
import EventHandler = React.EventHandler;
import FormEvent = React.FormEvent;

interface IConfigurationPanelProps {
    dispatch?: (action: {type: string, payload: any}) => void;
}

class ConfigurationPanel extends React.Component<IConfigurationPanelProps, any> {
    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Configuration"));
    }

    public render() {
        return (
            <div className="panel-flexbox">
                <ConfigurationNamesPanel/>
                <ConfigurationDetailsPanel/>
            </div>
        )
    }
}

export default connect()(ConfigurationPanel);
