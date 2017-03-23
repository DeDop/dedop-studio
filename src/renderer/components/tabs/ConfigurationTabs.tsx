import * as React from "react";
import * as CodeMirror from "react-codemirror";
import {ProcessConfigurations, State} from "../../state";
import {Tabs, TabList, Tab, TabPanel} from "@blueprintjs/core";
import {ConfigurationEditor, CnfConfigurationEditor} from "../ConfigurationEditor";
import "codemirror/mode/javascript/javascript";
import {connect, Dispatch} from "react-redux";
import {updateConfigEditorMode, saveConfiguration, updateConfigurationTab} from "../../actions";
import * as selector from "../../selectors";

interface IConfigurationTabsProps {
    dispatch?: Dispatch<State>;
    chd: ProcessConfigurations;
    cnf: ProcessConfigurations;
    cst: ProcessConfigurations;
    codeEditorActive: boolean;
    activeConfiguration: string;
    currentTab: number;
}

function mapStateToProps(state: State): IConfigurationTabsProps {
    return {
        chd: selector.getSelectedChd(state),
        cnf: selector.getSelectedCnf(state),
        cst: selector.getSelectedCst(state),
        codeEditorActive: state.control.codeEditorActive,
        activeConfiguration: state.control.selectedConfigurationName,
        currentTab: state.control.currentConfigurationTabPanel
    }
}

class ConfigurationTabs extends React.Component<IConfigurationTabsProps,any> {
    constructor(props) {
        super(props);
        this.handleChangeMode = this.handleChangeMode.bind(this);

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
            cstVersion: cstVersion
        });
    }

    private static getConfigVersion(config: ProcessConfigurations) {
        if (config) {
            if ("__metainf__" in config) {
                return config["__metainf__"]["version"];
            } else {
                return "N/A";
            }
        } else {
            return "N/A";
        }
    }

    private handleChangeMode() {
        this.props.dispatch(updateConfigEditorMode(!this.props.codeEditorActive));
    }

    public render() {
        const updateChdCode = (newCode: string) => {
            this.setState({
                chdTemp: JSON.parse(newCode),
            });
        };

        const updateCnfCode = (newCode: string) => {
            this.setState({
                cnfTemp: JSON.parse(newCode),
            });
        };

        const updateCstCode = (newCode: string) => {
            this.setState({
                cstTemp: JSON.parse(newCode),
            });
        };

        const options = {
            lineNumbers: true,
            mode: {
                name: "javascript",
                json: true
            },
            lineWrapping: true
        };

        const handleSaveConfig = () => {
            const chd = this.state.chdTemp;
            const cnf = this.state.cnfTemp;
            const cst = this.state.cstTemp;
            this.props.dispatch(saveConfiguration(this.props.activeConfiguration, chd, cnf, cst));
        };

        const handleChdInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
            const chdConfigurations = this.props.chd;
            chdConfigurations[event.currentTarget.name].value = event.currentTarget.value;
            this.setState({
                chdTemp: chdConfigurations
            })
        };

        const handleCnfInputChange = (event: any) => {
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

        const handleCstInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
            const cstConfigurations = this.props.cst;
            cstConfigurations[event.currentTarget.name].value = event.currentTarget.value;
            this.setState({
                cstTemp: cstConfigurations
            })
        };

        const handleChangeTab = (selectedTabIndex: number) => {
            this.props.dispatch(updateConfigurationTab(selectedTabIndex));
        };


        return (
            <div>
                <div style={{display:'flex', margin: '10px 0', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <label className="pt-control pt-switch" style={{margin: '0 0 0 10px'}}>
                        <input type="checkbox" onChange={this.handleChangeMode}
                               checked={this.props.codeEditorActive}/>
                        <span className="pt-control-indicator"/>
                        Code editor
                    </label>
                    <button className="pt-button pt-intent-primary" onClick={handleSaveConfig}>
                        Save Configuration
                    </button>
                </div>
                <Tabs key="horizontal"
                      onChange={handleChangeTab}
                      selectedTabIndex={this.props.currentTab ? this.props.currentTab : 0}
                >
                    <TabList>
                        <Tab>Characterization</Tab>
                        <Tab>Configuration</Tab>
                        <Tab>Constants</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            {this.props.codeEditorActive
                                ?
                                <CodeMirror
                                    value={this.state.chdTemp ? JSON.stringify(this.state.chdTemp, null, 4) : "please select a configuration"}
                                    onChange={updateChdCode}
                                    options={options}/>
                                :
                                <div>
                                    <span className="pt-tag pt-large">Version {this.state.chdVersion}</span>
                                    <ConfigurationEditor configurations={this.props.chd}
                                                         handleInputChange={handleChdInputChange}/>
                                </div>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            {this.props.codeEditorActive
                                ?
                                <CodeMirror
                                    value={this.state.cnfTemp ? JSON.stringify(this.state.cnfTemp, null, 4) : "please select a configuration"}
                                    onChange={updateCnfCode}
                                    options={options}/>
                                :
                                <div>
                                    <span className="pt-tag pt-large">Version {this.state.cnfVersion}</span>
                                    <CnfConfigurationEditor configurations={this.state.cnfTemp}
                                                            handleInputChange={handleCnfInputChange}/>
                                </div>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            {this.props.codeEditorActive
                                ?
                                <CodeMirror
                                    value={this.state.cstTemp ? JSON.stringify(this.state.cstTemp, null, 4) : "please select a configuration"}
                                    onChange={updateCstCode}
                                    options={options}/>
                                :
                                <div>
                                    <span className="pt-tag pt-large">Version {this.state.cstVersion}</span>
                                    <ConfigurationEditor configurations={this.state.cstTemp}
                                                         handleInputChange={handleCstInputChange}/>
                                </div>
                            }
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ConfigurationTabs)
