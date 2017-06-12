import * as React from "react";
import * as CodeMirror from "react-codemirror";
import {ConfigurationVersion, ProcessConfigurations, State} from "../../state";
import {Tab2, Tabs2} from "@blueprintjs/core";
import {CnfConfigurationEditor, ConfigurationEditor} from "../ConfigurationEditor";
import "codemirror/mode/javascript/javascript";
import {connect, Dispatch} from "react-redux";
import {
    saveConfiguration,
    updateConfigEditorMode,
    updateConfigurationTab,
    updateUnsavedConfigStatus,
    upgradeConfigurations
} from "../../actions";
import * as selector from "../../selectors";

const CONFIGURATION_VERSION_NOT_FOUND = -1;
const CONFIGURATION_NOT_FOUND = -2;

interface IConfigurationTabsProps {
    dispatch?: Dispatch<State>;
    chd?: ProcessConfigurations;
    cnf?: ProcessConfigurations;
    cst?: ProcessConfigurations;
    defaultConfVersion?: ConfigurationVersion;
    codeEditorActive?: boolean;
    selectedConfigurationName?: string;
    currentTab?: number;
    unsavedConfigChanges?: boolean;
    isCnfEditable?: boolean;
    isChdEditable?: boolean;
    isCstEditable?: boolean;
}

function mapStateToProps(state: State): IConfigurationTabsProps {
    return {
        chd: selector.getSelectedChd(state),
        cnf: selector.getSelectedCnf(state),
        cst: selector.getSelectedCst(state),
        defaultConfVersion: state.data.version ? state.data.version.configuration : null,
        codeEditorActive: state.control.codeEditorActive,
        selectedConfigurationName: state.control.selectedConfigurationName,
        currentTab: state.control.currentConfigurationTabPanel,
        unsavedConfigChanges: state.control.unsavedConfigChanges,
        isCnfEditable: state.control.isCnfEditable,
        isChdEditable: state.control.isChdEditable,
        isCstEditable: state.control.isCstEditable,
    }
}

class ConfigurationTabs extends React.Component<IConfigurationTabsProps, any> {
    constructor(props) {
        super(props);
        this.handleChangeMode = this.handleChangeMode.bind(this);
        this.updateChdCode = this.updateChdCode.bind(this);
        this.updateCnfCode = this.updateCnfCode.bind(this);
        this.updateCstCode = this.updateCstCode.bind(this);
        this.handleSaveConfig = this.handleSaveConfig.bind(this);
        this.handleCnfInputChange = this.handleCnfInputChange.bind(this);
        this.handleCstInputChange = this.handleCstInputChange.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.handleUpgradeConfig = this.handleUpgradeConfig.bind(this);
        this.renderCharacterizationTabPanel = this.renderCharacterizationTabPanel.bind(this);
        this.renderConfigurationTabPanel = this.renderConfigurationTabPanel.bind(this);
        this.renderConstantsTabPanel = this.renderConstantsTabPanel.bind(this);

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
        if (!(this.state.chdTemp == JSON.parse(newCode))) {
            this.props.dispatch(updateUnsavedConfigStatus(true));
        }
        this.setState({
            chdTemp: JSON.parse(newCode),
        });
    };

    private updateCnfCode = (newCode: string) => {
        if (!(this.state.cnfTemp == JSON.parse(newCode))) {
            this.props.dispatch(updateUnsavedConfigStatus(true));
        }
        this.setState({
            cnfTemp: JSON.parse(newCode),
        });
    };

    private updateCstCode = (newCode: string) => {
        if (!(this.state.cstTemp == JSON.parse(newCode))) {
            this.props.dispatch(updateUnsavedConfigStatus(true));
        }
        this.setState({
            cstTemp: JSON.parse(newCode),
        });
    };

    private handleSaveConfig = () => {
        const chd = this.state.chdTemp;
        const cnf = this.state.cnfTemp;
        const cst = this.state.cstTemp;
        this.props.dispatch(saveConfiguration(this.props.selectedConfigurationName, chd, cnf, cst));
        this.props.dispatch(updateUnsavedConfigStatus(false));
    };

    private handleChdInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const chdConfigurations = this.props.chd;
        chdConfigurations[event.currentTarget.name].value = parseFloat(event.currentTarget.value) || event.currentTarget.value;
        this.setState({
            chdTemp: chdConfigurations
        })
    };

    private handleCnfInputChange = (event: any) => {
        const cnfConfigurations = this.props.cnf;
        if (event.currentTarget.type == 'checkbox') {
            cnfConfigurations[event.currentTarget.name].value = event.currentTarget.checked;
        } else {
            cnfConfigurations[event.currentTarget.name].value = parseFloat(event.currentTarget.value) || event.currentTarget.value;
        }
        this.setState({
            cnfTemp: cnfConfigurations
        });
    };

    private handleCstInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const cstConfigurations = this.props.cst;
        cstConfigurations[event.currentTarget.name].value = parseFloat(event.currentTarget.value) || event.currentTarget.value;
        this.setState({
            cstTemp: cstConfigurations
        })
    };

    private handleChangeTab = (selectedTabIndex: number) => {
        this.props.dispatch(updateConfigurationTab(selectedTabIndex));
    };

    private handleUpgradeConfig = () => {
        this.props.dispatch(upgradeConfigurations(this.props.selectedConfigurationName));
    };

    private renderCharacterizationTabPanel() {
        const codeMirrorOptions = Object.assign({}, this.state.options, {readOnly: !this.props.isChdEditable});
        return (
            <div className="panel-flexbox-configs">
                {this.props.codeEditorActive
                    ?
                    <CodeMirror
                        value={this.state.chdTemp ? JSON.stringify(this.state.chdTemp, null, 4) : "please select a configuration"}
                        onChange={this.updateChdCode}
                        options={codeMirrorOptions}
                        className="dedop-codemirror"
                    />
                    :
                    (
                        this.state.chdVersion != CONFIGURATION_NOT_FOUND
                            ?
                            <div>
                                            <span
                                                className={"pt-tag ".concat(this.state.chdVersion < this.props.defaultConfVersion.chd ? "pt-intent-warning" : "pt-intent-success")}
                                                style={{opacity: 0.5}}
                                            >
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
                                                     handleInputChange={this.handleChdInputChange}
                                                     dispatch={this.props.dispatch}
                                                     disabled={!this.props.isChdEditable}
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

    private renderConfigurationTabPanel() {
        const codeMirrorOptions = Object.assign({}, this.state.options, {readOnly: !this.props.isCnfEditable});
        return (
            <div className="panel-flexbox-configs">
                {this.props.codeEditorActive
                    ?
                    <CodeMirror
                        value={this.state.cnfTemp ? JSON.stringify(this.state.cnfTemp, null, 4) : "please select a configuration"}
                        onChange={this.updateCnfCode}
                        options={codeMirrorOptions}
                        className="dedop-codemirror"
                    />
                    :
                    (
                        this.state.cnfVersion != CONFIGURATION_NOT_FOUND
                            ?
                            <div>
                                            <span
                                                className={"pt-tag ".concat(this.state.cnfVersion < this.props.defaultConfVersion.cnf ? "pt-intent-warning" : "pt-intent-success")}
                                                style={{opacity: 0.5}}
                                            >
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
                                                        handleInputChange={this.handleCnfInputChange}
                                                        dispatch={this.props.dispatch}
                                                        disabled={!this.props.isCnfEditable}
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

    private renderConstantsTabPanel() {
        const codeMirrorOptions = Object.assign({}, this.state.options, {readOnly: !this.props.isCstEditable});
        return (
            <div className="panel-flexbox-configs">
                {this.props.codeEditorActive
                    ?
                    <CodeMirror
                        value={this.state.cstTemp ? JSON.stringify(this.state.cstTemp, null, 4) : "please select a configuration"}
                        onChange={this.updateCstCode}
                        options={codeMirrorOptions}
                        className="dedop-codemirror"
                    />
                    :
                    (
                        this.state.cstVersion != CONFIGURATION_NOT_FOUND
                            ?
                            <div>
                                            <span
                                                className={"pt-tag ".concat(this.state.cstVersion < this.props.defaultConfVersion.cst ? "pt-intent-warning" : "pt-intent-success")}
                                                style={{opacity: 0.5}}
                                            >
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
                                                     handleInputChange={this.handleCstInputChange}
                                                     dispatch={this.props.dispatch}
                                                     disabled={!this.props.isCstEditable}
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

    public render() {
        return (
            <div style={{height: 'calc(100% - 50px)'}}>
                <div style={{display: 'flex', margin: '10px 0', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <label className="pt-control pt-switch" style={{margin: '0 0 0 10px'}}>
                        <input type="checkbox" onChange={this.handleChangeMode}
                               checked={this.props.codeEditorActive}/>
                        <span className="pt-control-indicator"/>
                        Code editor
                    </label>
                    <button className="pt-button pt-intent-primary"
                            onClick={this.handleSaveConfig}
                            disabled={!this.props.selectedConfigurationName || !this.props.unsavedConfigChanges}
                    >
                        Save Configuration
                    </button>
                </div>
                <Tabs2
                    id="ConfigurationTab"
                    onChange={this.handleChangeTab}
                    defaultSelectedTabId={0}
                    selectedTabId={this.props.currentTab}
                    renderActiveTabPanelOnly={true}
                    className="dedop-configuration-tab"
                >
                    <Tab2 id={0} title="Configuration" panel={this.renderConfigurationTabPanel()} className="dedop-config-tab-panel"/>
                    <Tab2 id={1} title="Characterization" panel={this.renderCharacterizationTabPanel()} className="dedop-config-tab-panel"/>
                    <Tab2 id={2} title="Constants" panel={this.renderConstantsTabPanel()} className="dedop-config-tab-panel"/>
                </Tabs2>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ConfigurationTabs)
