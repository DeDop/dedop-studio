import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {State} from "../../state";
import * as selectors from "../../selectors";
import {connect, Dispatch} from "react-redux";
import {setCurrentConfig} from "../../actions";
import {SelectComponent} from "../common/SelectComponent";

interface IRunSettingsPanelProps {
    dispatch?: Dispatch<State>;
    configurationFiles?: string[];
    currentConfigurationName?: string;
    processName?: string;
}

function mapStateToProps(state: State): IRunSettingsPanelProps {
    return {
        configurationFiles: selectors.getConfigurationNames(state),
        currentConfigurationName: state.control.currentConfigurationName,
        processName: state.control.processName
    }
}

class RunSettingsPanel extends React.Component<IRunSettingsPanelProps, any> {
    componentWillReceiveProps(nextProps) {
        this.setState({
            processName: nextProps.processName
        })
    }

    public state = {
        processName: this.props.processName
    };

    render() {
        let options = [];
        for (let i in this.props.configurationFiles) {
            options.push(<option key={i}>{this.props.configurationFiles[i]}</option>)
        }

        const handleOnChangeConfiguration = (event: React.FormEvent<HTMLSelectElement>) => {
            this.props.dispatch(setCurrentConfig(event.currentTarget.value));
        };

        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="Run Settings" icon="pt-icon-properties"/>
                <div className="dedop-panel-content">
                    <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <td>
                                Configuration
                            </td>
                            <td>
                                <SelectComponent items={this.props.configurationFiles}
                                                 fill={true}
                                                 defaultValue="Select a configuration..."
                                                 selectedItem={this.props.currentConfigurationName}
                                                 onChange={handleOnChangeConfiguration}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(RunSettingsPanel);
