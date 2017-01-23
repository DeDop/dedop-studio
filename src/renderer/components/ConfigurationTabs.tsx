import * as React from 'react';
import * as CodeMirror from "react-codemirror";
import {ProcessConfigurations, State} from "../state";
import {Tabs, TabList, Tab, TabPanel} from "@blueprintjs/core";
import {ConfigurationEditor, CnfConfigurationEditor} from "./ConfigurationEditor";
import 'codemirror/mode/javascript/javascript';
import {connect} from "react-redux";
import MouseEventHandler = React.MouseEventHandler;
import {updateConfigEditorMode, saveConfiguration} from "../actions";
import * as selector from "../selectors"

interface IConfigurationTabsProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    chd: ProcessConfigurations;
    cnf: ProcessConfigurations;
    cst: ProcessConfigurations;
    codeEditorActive: boolean;
    activeConfiguration: string;
}

function mapStateToProps(state: State): IConfigurationTabsProps {
    return {
        chd: selector.getSelectedChd(state),
        cnf: selector.getSelectedCnf(state),
        cst: selector.getSelectedCst(state),
        codeEditorActive: state.control.codeEditorActive,
        activeConfiguration: state.control.selectedConfiguration
    }
}

class ConfigurationTabs extends React.Component<IConfigurationTabsProps,any> {
    constructor(props) {
        super(props);
        this.handleChangeMode = this.handleChangeMode.bind(this);
        this.updateCode = this.updateCode.bind(this);
        this.updateChdCode = this.updateChdCode.bind(this);
        this.updateCnfCode = this.updateCnfCode.bind(this);
        this.updateCstCode = this.updateCstCode.bind(this);
    }

    private handleChangeMode() {
        this.props.dispatch(updateConfigEditorMode(this.props.codeEditorActive));
    }

    private updateCode(newCode: string) {
        this.setState({
            code: newCode,
        });
    };

    private updateChdCode(event: any) {
        this.setState({
            chdCode: event.target.value,
        });
    };

    private updateCnfCode(event: any) {
        this.setState({
            cnfCode: event.target.value,
        });
    };

    private updateCstCode(event: any) {
        this.setState({
            cstCode: event.target.value,
        });
    };

    public render() {
        this.state = {
            chdCode: (JSON.stringify(this.props.chd, null, 4)),
            cnfCode: (JSON.stringify(this.props.cnf, null, 4)),
            cstCode: (JSON.stringify(this.props.cst, null, 4)),
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
            const chd = JSON.parse(this.state.chdCode);
            const cnf = JSON.parse(this.state.cnfCode);
            const cst = JSON.parse(this.state.cstCode);
            this.props.dispatch(saveConfiguration(this.props.activeConfiguration, chd, cnf, cst));
        };

        return (
            <div>
                <div style={{display:'flex', margin: '10px 0', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <label className="pt-control pt-switch" style={{margin: '0 0 0 10px'}}>
                        <input type="checkbox" onChange={this.handleChangeMode}
                               checked={this.state.codeEditor}/>
                        <span className="pt-control-indicator"/>
                        Code editor
                    </label>
                    <button className="pt-button pt-intent-primary" onClick={handleSaveConfig}>
                        Save Configuration
                    </button>
                </div>
                <Tabs key="horizontal">
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
                                    value={this.state.chdCode != 'null' ? this.state.chdCode : "please select a configuration"}
                                    options={options}/>
                                :
                                <ConfigurationEditor configurations={this.props.chd}/>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            {this.props.codeEditorActive
                                ?
                                <CodeMirror
                                    value={this.state.cnfCode != 'null' ? this.state.cnfCode : "please select a configuration"}
                                    options={options}/>
                                :
                                <CnfConfigurationEditor configurations={this.props.cnf}/>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            {this.props.codeEditorActive
                                ?
                                <CodeMirror
                                    value={this.state.cstCode != 'null' ? this.state.cstCode : "please select a configuration"}
                                    options={options}/>
                                :
                                <ConfigurationEditor configurations={this.props.cst}/>
                            }
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ConfigurationTabs)
