import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {State} from "../../state";
import * as selectors from "../../selectors";
import {connect, Dispatch} from "react-redux";
import {setProcessName, getAllConfigs, setCurrentConfig} from "../../actions";

interface IRunSettingsPanelProps {
    dispatch?: Dispatch<State>;
    configurationFiles: string[];
    currentConfiguration: string;
    processName: string;
}

function mapStateToProps(state: State): IRunSettingsPanelProps {
    return {
        configurationFiles: selectors.getConfigurationNames(state),
        currentConfiguration: state.control.currentConfigurationName,
        processName: state.control.processName
    }
}

class RunSettingsPanel extends React.Component<IRunSettingsPanelProps,any> {
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

        const handleOnChange = (event: any) => {
            this.setState({
                processName: event.target.value
            });
        };

        const handleOnBlur = () => {
            this.props.dispatch(setProcessName(this.state.processName));
        };

        const handleOnChangeConfiguration = (event: React.FormEvent<HTMLSelectElement>) => {
            this.props.dispatch(setCurrentConfig(event.currentTarget.value));
        };

        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="Run Settings" icon="pt-icon-properties"/>
                <div className="dedop-panel-content">
                    <table width='100%'>
                        <tbody>
                        <tr>
                            <td width='20%'>
                                Process name
                            </td>
                            <td width='80%'>
                                <input className="pt-input pt-fill"
                                       type="text"
                                       placeholder="Process name"
                                       dir="auto"
                                       value={this.state.processName}
                                       onChange={handleOnChange}
                                       onBlur={handleOnBlur}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Configuration
                            </td>
                            <td>
                                <div className="pt-select pt-fill">
                                    <select onChange={handleOnChangeConfiguration}
                                            value={this.props.currentConfiguration ? this.props.currentConfiguration : undefined}
                                    >
                                        {options}
                                    </select>
                                </div>
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
