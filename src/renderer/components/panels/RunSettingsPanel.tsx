import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {State} from "../../state";
import * as selectors from "../../selectors";
import {connect} from "react-redux";

interface IRunSettingsPanelProps {
    configurationFiles: string[];
    selectedConfiguration: string;
}

function mapStateToProps(state: State): IRunSettingsPanelProps {
    return {
        configurationFiles: selectors.getConfigurationNames(state),
        selectedConfiguration: state.control.selectedConfiguration
    }
}

class RunSettingsPanel extends React.Component<IRunSettingsPanelProps,any> {
    render() {
        let options = [];
        for (let i in this.props.configurationFiles) {
            if (this.props.selectedConfiguration == this.props.configurationFiles[i]) {
                options.push(<option selected key={i}>{this.props.configurationFiles[i]}</option>);
            } else {
                options.push(<option key={i}>{this.props.configurationFiles[i]}</option>)
            }
        }
        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="Run Settings" icon="pt-icon-properties"/>
                <div className="dedop-panel-content">
                    <table width='100%'>
                        <tbody>
                        <tr>
                            <td width='20%'>
                                Name
                            </td>
                            <td width='80%'>
                                <input className="pt-input pt-fill" type="text" placeholder="Process name"
                                       dir="auto"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Configuration
                            </td>
                            <td>
                                <div className="pt-select pt-fill">
                                    <select>
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
