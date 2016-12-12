import * as React from 'react';
import * as CodeMirror from "react-codemirror";
import {ProcessConfigurations, State} from "../state";
import {Tabs, TabList, Tab, TabPanel} from "@blueprintjs/core";
import {ConfigurationEditor, CnfConfigurationEditor} from "./ConfigurationEditor";
import 'codemirror/mode/javascript/javascript';
import {connect} from "react-redux";
import MouseEventHandler = React.MouseEventHandler;
import {updateConfigEditorMode, saveConfiguration} from "../actions";

interface IConfigurationTabsProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    chd: ProcessConfigurations;
    cnf: ProcessConfigurations;
    cst: ProcessConfigurations;
    codeEditorActive: boolean;
}

function mapStateToProps(state: State): IConfigurationTabsProps {
    return {
        chd: state.data.chd,
        cnf: state.data.cnf,
        cst: state.data.cst,
        codeEditorActive: state.control.codeEditorActive
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

        this.state = {
            chdCode: (JSON.stringify(this.props.chd)),
            cnfCode: (JSON.stringify(this.props.cnf)),
            cstCode: (JSON.stringify(this.props.cst)),
            mode: "javascript"
        };
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
        const options = {
            lineNumbers: true,
            mode: this.state.mode
        };

        const handleSaveConfig = () => {
            console.log("saving configuration - not yet implemented", JSON.parse(this.state.chdCode));

            const chd = JSON.parse(this.state.chdCode);
            const cnf = JSON.parse(this.state.cnfCode);
            const cst = JSON.parse(this.state.cstCode);
            this.props.dispatch(saveConfiguration(chd, cnf, cst));
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
                                <textarea className="pt-input pt-fill"
                                          dir="auto"
                                          ref="chdEditor"
                                          value={this.state.chdCode}
                                          onChange={this.updateChdCode}
                                />
                                :
                                <ConfigurationEditor configurations={this.props.chd}/>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            {this.props.codeEditorActive
                                ?
                                <textarea className="pt-input pt-fill"
                                          dir="auto"
                                          ref="cnfEditor"
                                          value={this.state.cnfCode}
                                          onChange={this.updateCnfCode}
                                />
                                :
                                <CnfConfigurationEditor configurations={this.props.cnf}/>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="panel-flexbox-configs">
                            {this.props.codeEditorActive
                                ?
                                <textarea className="pt-input pt-fill"
                                          dir="auto"
                                          ref="cnfEditor"
                                          value={this.state.cstCode}
                                          onChange={this.updateCstCode}
                                />
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
