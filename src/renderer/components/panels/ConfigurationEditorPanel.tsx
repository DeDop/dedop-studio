import * as React from 'react';
import {ConfigurationEditor} from '../ConfigurationEditor';
import {connect, Dispatch} from 'react-redux';
import {ConfigurationVersion, ProcessConfigurations, State} from '../../state';
import {
    updateChdTemp,
    updateCnfTemp,
    updateCstTemp,
    updateUnsavedConfigStatus,
    upgradeConfigurations
} from '../../actions';
import * as selector from '../../selectors';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/snippets/json';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

interface IConfigurationEditorPanelProps {
    dispatch?: Dispatch<State>;
    chd?: ProcessConfigurations;
    cnf?: ProcessConfigurations;
    cst?: ProcessConfigurations;
    defaultConfVersion?: ConfigurationVersion;
    selectedConfigurationName?: string;
    codeEditorActive: boolean;
    isConfigEditable: boolean;
    configType: string;
}

interface ConfigurationEditorPanelOwnProps {
    codeEditorActive: boolean;
    isConfigEditable: boolean;
    configType: string;
}

function mapStateToProps(state: State, ownProps: ConfigurationEditorPanelOwnProps): IConfigurationEditorPanelProps {
    return {
        chd: selector.getSelectedChd(state),
        cnf: selector.getSelectedCnf(state),
        cst: selector.getSelectedCst(state),
        defaultConfVersion: state.data.version ? state.data.version.configuration : null,
        selectedConfigurationName: state.control.selectedConfigurationName,
        codeEditorActive: ownProps.codeEditorActive,
        isConfigEditable: ownProps.isConfigEditable,
        configType: ownProps.configType
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
            configTempValid: false,
            configVersion: configVersion
        };
    };

    componentWillReceiveProps(nextProps) {
        const configVersion = ConfigurationEditorPanel.getConfigVersion(nextProps[nextProps.configType]);
        this.setState({
            configTemp: nextProps[nextProps.configType],
            configVersion: configVersion,
        });
    }

    private updateLocalConfigCode = (newCode: string) => {
        try {
            if (!(this.state.configTemp == JSON.parse(newCode))) {
                this.props.dispatch(updateUnsavedConfigStatus(true));
            }
            this.setState({
                configTemp: JSON.parse(newCode),
                configTempValid: true
            })
        } catch (err) {
            console.warn('error when parsing json', err);
        }
    };

    private updateConfigCode = () => {
        if (this.props.configType === 'chd') {
            this.props.dispatch(updateChdTemp(this.state.configTemp));
        } else if (this.props.configType === 'cnf') {
            this.props.dispatch(updateCnfTemp(this.state.configTemp));
        } else if (this.props.configType === 'cst') {
            this.props.dispatch(updateCstTemp(this.state.configTemp));
        }
    };

    private static getConfigVersion(config: ProcessConfigurations): number {
        if (config) {
            if ('__metainf__' in config) {
                return config['__metainf__']['version'];
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
        return (
            <div className="panel-flexbox-configs">
                {this.props.codeEditorActive
                    ?
                    <AceEditor
                        mode="json"
                        theme="monokai"
                        name="Configuration Editor"
                        editorProps={{$blockScrolling: true}}
                        showGutter={false}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            tabSize: 2,
                            useWorker: false
                        }}
                        value={this.state.configTemp ? JSON.stringify(this.state.configTemp, null, 4) : 'please select a configuration'}
                        width='100%'
                        height='100%'
                        showPrintMargin={false}
                        readOnly={!this.props.isConfigEditable}
                        onChange={this.updateLocalConfigCode}
                        onBlur={this.updateConfigCode}
                    />
                    :
                    (
                        this.state.configVersion != CONFIGURATION_NOT_FOUND
                            ?
                            <div>
                                <span
                                    className={'pt-tag '.concat(this.state.configVersion < this.props.defaultConfVersion[this.props.configType] ? 'pt-intent-warning' : 'pt-intent-success')}
                                    style={{opacity: 0.5}}
                                >
                                    Version {this.state.configVersion >= 0 ? this.state.configVersion : 'N/A'}
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
