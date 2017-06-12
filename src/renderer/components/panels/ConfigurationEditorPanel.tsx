import * as React from "react";
import * as CodeMirror from "react-codemirror";
import {ConfigurationEditor} from "../ConfigurationEditor";
import {connect, Dispatch} from "react-redux";
import {ConfigurationVersion, ProcessConfigurations, State} from "../../state";
import {updateUnsavedConfigStatus, upgradeConfigurations} from "../../actions";
import * as selector from "../../selectors";

interface IConfigurationEditorPanelProps {
    dispatch?: Dispatch<State>;
    chd?: ProcessConfigurations;
    cnf?: ProcessConfigurations;
    cst?: ProcessConfigurations;
    defaultConfVersion?: ConfigurationVersion;
    selectedConfigurationName?: string;
}

interface  ConfigurationEditorPanelOwnProps {
    codeEditorActive: boolean;
    isConfigEditable: boolean;
    configType: string;
}

function mapStateToProps(state: State) {
    return {
        chd: selector.getSelectedChd(state),
        cnf: selector.getSelectedCnf(state),
        cst: selector.getSelectedCst(state),
        defaultConfVersion: state.data.version ? state.data.version.configuration : null,
        selectedConfigurationName: state.control.selectedConfigurationName,
    }
}

const CONFIGURATION_VERSION_NOT_FOUND = -1;
const CONFIGURATION_NOT_FOUND = -2;

class ConfigurationEditorPanel extends React.Component<IConfigurationEditorPanelProps & ConfigurationEditorPanelOwnProps, any> {
    constructor(props) {
        super(props);
        const configVersion = ConfigurationEditorPanel.getConfigVersion(props[props.configType]);
        this.state = {
            configTemp: props[props.configType],
            configVersion: configVersion,
            options: {
                lineNumbers: true,
                mode: {
                    name: "javascript",
                    json: true
                },
                lineWrapping: true
            }
        };
    };

    componentWillReceiveProps(nextProps) {
        const configVersion = ConfigurationEditorPanel.getConfigVersion(nextProps[nextProps.configType]);
        this.setState({
            configTemp: nextProps[nextProps.configType],
            configVersion: configVersion,
        });
    }

    private updateConfigCode = (newCode: string) => {
        if (!(this.state.configTemp == JSON.parse(newCode))) {
            this.props.dispatch(updateUnsavedConfigStatus(true));
        }
        this.setState({
            configTemp: JSON.parse(newCode),
        });
    };

    private static getConfigVersion(config: ProcessConfigurations): number {
        if (config) {
            if ("__metainf__" in config) {
                return config["__metainf__"]["version"];
            } else {
                return CONFIGURATION_VERSION_NOT_FOUND;
            }
        } else {
            return CONFIGURATION_NOT_FOUND;
        }
    };

    private handleUpgradeConfig = () => {
        this.props.dispatch(upgradeConfigurations(this.props.selectedConfigurationName));
    };

    private handleConfigInputChange = (event: any) => {
        const configurations = this.props[this.props.configType];
        if (event.currentTarget.type == 'checkbox') {
            configurations[event.currentTarget.name].value = event.currentTarget.checked;
        } else {
            configurations[event.currentTarget.name].value = parseFloat(event.currentTarget.value) || event.currentTarget.value;
        }
        this.setState({
            configTemp: configurations
        })
    };

    render() {
        const codeMirrorOptions = Object.assign({}, this.state.options, {readOnly: !this.props.isConfigEditable});
        return (
            <div className="panel-flexbox-configs">
                {this.props.codeEditorActive
                    ?
                    <CodeMirror
                        value={this.state.configTemp ? JSON.stringify(this.state.configTemp, null, 4) : "please select a configuration"}
                        onChange={this.updateConfigCode}
                        options={codeMirrorOptions}
                        className="dedop-codemirror"
                    />
                    :
                    (
                        this.state.configVersion != CONFIGURATION_NOT_FOUND
                            ?
                            <div>
                                <span
                                    className={"pt-tag ".concat(this.state.configVersion < this.props.defaultConfVersion[this.props.configType] ? "pt-intent-warning" : "pt-intent-success")}
                                    style={{opacity: 0.5}}
                                >
                                    Version {this.state.configVersion >= 0 ? this.state.configVersion : "N/A"}
                                </span>
                                {
                                    this.state.configVersion == CONFIGURATION_VERSION_NOT_FOUND || this.state.configVersion < this.props.defaultConfVersion[this.props.configType]
                                        ?
                                        <span className="pt-tag pt-icon-double-chevron-up pt-intent-primary"
                                              onClick={this.handleUpgradeConfig}
                                        >
                                            upgrade
                                        </span>
                                        :
                                        null
                                }
                                <ConfigurationEditor configurations={this.props[this.props.configType]}
                                                        handleInputChange={this.handleConfigInputChange}
                                                        dispatch={this.props.dispatch}
                                                        disabled={!this.props.isConfigEditable}
                                />
                            </div>
                            :
                            <div>
                                Please select a configuration.
                            </div>
                    )
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(ConfigurationEditorPanel)
