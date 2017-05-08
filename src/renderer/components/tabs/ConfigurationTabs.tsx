import * as React from "react";
import * as CodeMirror from "react-codemirror";
import {ProcessConfigurations, State, ConfigurationVersion} from "../../state";
import {Tabs2, Tab2} from "@blueprintjs/core";
import {ConfigurationEditor, CnfConfigurationEditor} from "../ConfigurationEditor";
import "codemirror/mode/javascript/javascript";
import {connect, Dispatch} from "react-redux";
import {updateConfigEditorMode, saveConfiguration, updateConfigurationTab, upgradeConfigurations} from "../../actions";
import * as selector from "../../selectors";

const CONFIGURATION_VERSION_NOT_FOUND = -1;
const CONFIGURATION_NOT_FOUND = -2;

interface IConfigurationTabsProps {
    dispatch?: Dispatch<State>;
    chd: ProcessConfigurations;
    cnf: ProcessConfigurations;
    cst: ProcessConfigurations;
    defaultConfVersion: ConfigurationVersion;
    codeEditorActive: boolean;
    activeConfiguration: string;
    currentTab: number;
}

function mapStateToProps(state: State): IConfigurationTabsProps {
    return {
        chd: selector.getSelectedChd(state),
        cnf: selector.getSelectedCnf(state),
        cst: selector.getSelectedCst(state),
        defaultConfVersion: state.data.version.configuration,
        codeEditorActive: state.control.codeEditorActive,
        activeConfiguration: state.control.selectedConfigurationName,
        currentTab: state.control.currentConfigurationTabPanel
    }
}

class ConfigurationTabs extends React.Component<IConfigurationTabsProps,any> {
    constructor(props) {
        super(props);
        this.handleChangeMode = this.handleChangeMode.bind(this);
        this.updateChdCode = this.updateChdCode.bind(this);
        this.updateCnfCode = this.updateCnfCode.bind(this);
        this.updateCstCode = this.updateCstCode.bind(this);
        this.handleSaveConfig = this.handleSaveConfig.bind(this);
        this.handleChdInputChange = this.handleChdInputChange.bind(this);
        this.handleCnfInputChange = this.handleCnfInputChange.bind(this);
        this.handleCstInputChange = this.handleCstInputChange.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.handleUpgradeConfig = this.handleUpgradeConfig.bind(this);

        const chdVersion = ConfigurationTabs.getConfigVersion(this.props.chd);
        const cnfVersion = ConfigurationTabs.getConfigVersion(this.props.cnf);
        const cstVersion = ConfigurationTabs.getConfigVersion(this.props.cst);
        this.state = {
            chdTemp: this.props.chd,
            cnfTemp: this.props.cnf,
            cstTemp: this.props.cst,
            chdVersion: chdVersion,
            cnfVersion: cnfVersion,
            cstVersion: cstVersion
        };
    }

    componentWillReceiveProps(nextProps) {
        const chdVersion = ConfigurationTabs.getConfigVersion(nextProps.chd);
        const cnfVersion = ConfigurationTabs.getConfigVersion(nextProps.cnf);
        const cstVersion = ConfigurationTabs.getConfigVersion(nextProps.cst);
        this.setState({
            chdTemp: nextProps.chd,
            cnfTemp: nextProps.cnf,
            cstTemp: nextProps.cst,
            chdVersion: chdVersion,
            cnfVersion: cnfVersion,
            cstVersion: cstVersion,
            options: {
                lineNumbers: true,
                mode: {
                    name: "javascript",
                    json: true
                },
                lineWrapping: true
            }
        });
    }

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
    }

    private handleChangeMode() {
        this.props.dispatch(updateConfigEditorMode(!this.props.codeEditorActive));
    }

    private updateChdCode = (newCode: string) => {
        this.setState({
            chdTemp: JSON.parse(newCode),
        });
    };

    private updateCnfCode = (newCode: string) => {
        this.setState({
            cnfTemp: JSON.parse(newCode),
        });
    };

    private updateCstCode = (newCode: string) => {
        this.setState({
            cstTemp: JSON.parse(newCode),
        });
    };

    private handleSaveConfig = () => {
        const chd = this.state.chdTemp;
        const cnf = this.state.cnfTemp;
        const cst = this.state.cstTemp;
        this.props.dispatch(saveConfiguration(this.props.activeConfiguration, chd, cnf, cst));
    };

    private handleChdInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const chdConfigurations = this.props.chd;
        chdConfigurations[event.currentTarget.name].value = event.currentTarget.value;
        this.setState({
            chdTemp: chdConfigurations
        })
    };

    private handleCnfInputChange = (event: any) => {
        const cnfConfigurations = this.props.cnf;
        if (event.currentTarget.type == 'checkbox') {
            cnfConfigurations[event.currentTarget.name].value = event.currentTarget.checked;
        } else {
            cnfConfigurations[event.currentTarget.name].value = event.currentTarget.value;
        }
        this.setState({
            cnfTemp: cnfConfigurations
        })
    };

    private handleCstInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const cstConfigurations = this.props.cst;
        cstConfigurations[event.currentTarget.name].value = event.currentTarget.value;
        this.setState({
            cstTemp: cstConfigurations
        })
    };

    private handleChangeTab = (selectedTabIndex: number) => {
        this.props.dispatch(updateConfigurationTab(selectedTabIndex));
    };

    private handleUpgradeConfig = () => {
        this.props.dispatch(upgradeConfigurations(this.props.activeConfiguration));
    };

    private renderCharacterizationTabPanel() {
        return (
            <div className="panel-flexbox-configs">
                {this.props.codeEditorActive
                    ?
                    <CodeMirror
                        value={this.state.chdTemp ? JSON.stringify(this.state.chdTemp, null, 4) : "please select a configuration"}
                        onChange={this.updateChdCode}
                        options={this.state.options}/>
                    :
                    (
                        this.state.chdVersion != CONFIGURATION_NOT_FOUND
                            ?
                            <div>
                                            <span
                                                className={"pt-tag ".concat(this.state.chdVersion < this.props.defaultConfVersion.chd ? "pt-intent-warning" : "pt-intent-success")}>
                                                Version {this.state.chdVersion >= 0 ? this.state.chdVersion : "N/A"}
                                            </span>
                                {
                                    this.state.chdVersion == CONFIGURATION_VERSION_NOT_FOUND || this.state.chdVersion < this.props.defaultConfVersion.chd
                                        ?
                                        <span className="pt-tag pt-icon-double-chevron-up pt-intent-primary"
                                              onClick={this.handleUpgradeConfig}
                                        >
                                                        upgrade
                                                    </span>
                                        :
                                        null
                                }
                                <ConfigurationEditor configurations={this.props.chd}
                                                     handleInputChange={this.handleChdInputChange}/>
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

    private renderConfigurationTabPanel() {
        return (
            <div className="panel-flexbox-configs">
                {this.props.codeEditorActive
                    ?
                    <CodeMirror
                        value={this.state.cnfTemp ? JSON.stringify(this.state.cnfTemp, null, 4) : "please select a configuration"}
                        onChange={this.updateCnfCode}
                        options={this.state.options}/>
                    :
                    (
                        this.state.cnfVersion != CONFIGURATION_NOT_FOUND
                            ?
                            <div>
                                            <span
                                                className={"pt-tag ".concat(this.state.cnfVersion < this.props.defaultConfVersion.cnf ? "pt-intent-warning" : "pt-intent-success")}>
                                                Version {this.state.cnfVersion >= 0 ? this.state.cnfVersion : "N/A"}
                                            </span>
                                {
                                    this.state.cnfVersion == CONFIGURATION_VERSION_NOT_FOUND || this.state.cnfVersion < this.props.defaultConfVersion.cnf
                                        ?
                                        <span className="pt-tag pt-icon-double-chevron-up pt-intent-primary"
                                              onClick={this.handleUpgradeConfig}
                                        >
                                                        upgrade
                                                    </span>
                                        :
                                        null
                                }
                                <CnfConfigurationEditor configurations={this.props.cnf}
                                                        handleInputChange={this.handleCnfInputChange}/>
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

    private renderConstantsTabPanel() {
        return (
            <div className="panel-flexbox-configs">
                {this.props.codeEditorActive
                    ?
                    <CodeMirror
                        value={this.state.cstTemp ? JSON.stringify(this.state.cstTemp, null, 4) : "please select a configuration"}
                        onChange={this.updateCstCode}
                        options={this.state.options}/>
                    :
                    (
                        this.state.cstVersion != CONFIGURATION_NOT_FOUND
                            ?
                            <div>
                                            <span
                                                className={"pt-tag ".concat(this.state.cstVersion < this.props.defaultConfVersion.cst ? "pt-intent-warning" : "pt-intent-success")}>
                                                Version {this.state.cstVersion >= 0 ? this.state.cstVersion : "N/A"}
                                            </span>
                                {
                                    this.state.cstVersion == CONFIGURATION_VERSION_NOT_FOUND || this.state.cstVersion < this.props.defaultConfVersion.cst
                                        ?
                                        <span className="pt-tag pt-icon-double-chevron-up pt-intent-primary"
                                              onClick={this.handleUpgradeConfig}
                                        >
                                                        upgrade
                                                    </span>
                                        :
                                        null
                                }
                                <ConfigurationEditor configurations={this.props.cst}
                                                     handleInputChange={this.handleCstInputChange}/>
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

    public render() {
        return (
            <div>
                <div style={{display:'flex', margin: '10px 0', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <label className="pt-control pt-switch" style={{margin: '0 0 0 10px'}}>
                        <input type="checkbox" onChange={this.handleChangeMode}
                               checked={this.props.codeEditorActive}/>
                        <span className="pt-control-indicator"/>
                        Code editor
                    </label>
                    <button className="pt-button pt-intent-primary" onClick={this.handleSaveConfig}>
                        Save Configuration
                    </button>
                </div>
                <Tabs2
                    id="ConfigurationTab"
                    key="horizontal"
                    onChange={this.handleChangeTab}
                    selectedTabId={this.props.currentTab ? this.props.currentTab : 0}
                >
                    <Tab2 id={0} title="Characterization" panel={this.renderCharacterizationTabPanel()}/>
                    <Tab2 id={1} title="Configuration" panel={this.renderConfigurationTabPanel()}/>
                    <Tab2 id={2} title="Constants" panel={this.renderConstantsTabPanel()}/>
                </Tabs2>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ConfigurationTabs)
