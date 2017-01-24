import * as React from "react";
import * as CodeMirror from "react-codemirror";
import {ProcessConfigurations, State} from "../state";
import {Tabs, TabList, Tab, TabPanel} from "@blueprintjs/core";
import {ConfigurationEditor, CnfConfigurationEditor} from "./ConfigurationEditor";
import "codemirror/mode/javascript/javascript";
import {connect} from "react-redux";
import {updateConfigEditorMode, saveConfiguration, updateConfigurationTab} from "../actions";
import * as selector from "../selectors";
import MouseEventHandler = React.MouseEventHandler;
import FormEvent = React.FormEvent;

interface IConfigurationTabsProps {
    dispatch?: (action: {type: string, payload: any}) => void;
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
        activeConfiguration: state.control.selectedConfiguration,
        currentTab: state.control.currentConfigurationTabPanel
    }
}

class ConfigurationTabs extends React.Component<IConfigurationTabsProps,any> {
    constructor(props) {
        super(props);
        this.handleChangeMode = this.handleChangeMode.bind(this);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            chdTemp: nextProps.chd,
            cnfTemp: nextProps.cnf,
            cstTemp: nextProps.cst,
        };
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
            const chd = this.state.chd;
            const cnf = this.state.cnf;
            const cst = this.state.cst;
            this.props.dispatch(saveConfiguration(this.props.activeConfiguration, chd, cnf, cst));
        };

        const handleChdInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
            const chdConfigurations = this.props.chd;
            chdConfigurations[event.currentTarget.name].value = event.currentTarget.value;
            this.setState({
                chdTemp: chdConfigurations
            })
        };

        const handleCnfInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
            console.log("cnf-name", event.currentTarget.name)
            console.log("cnf-value", event.currentTarget.value)
        };

        const handleCstInputChange = (event: React.FormEvent<HTMLSelectElement>) => {
            console.log("cst-name", event.currentTarget.name)
            console.log("cst-value", event.currentTarget.value)
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
                                <ConfigurationEditor configurations={this.props.chd}
                                                     handleInputChange={handleChdInputChange}/>
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
                                <CnfConfigurationEditor configurations={this.state.cnfTemp}
                                                        handleInputChange={handleCnfInputChange}/>
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
                                <ConfigurationEditor configurations={this.state.cstTemp}
                                                     handleInputChange={handleCstInputChange}/>
                            }
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ConfigurationTabs)
