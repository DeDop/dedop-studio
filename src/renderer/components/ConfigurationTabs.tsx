import * as React from 'react';
import * as CodeMirror from "react-codemirror";
import {ProcessConfigurations, State} from "../state";
import {Tabs, TabList, Tab, TabPanel} from "@blueprintjs/core";
import {ConfigurationEditor, CnfConfigurationEditor} from "./ConfigurationEditor";
import 'codemirror/mode/javascript/javascript';
import {connect} from "react-redux";

interface IConfigurationTabsProps {
    chd: ProcessConfigurations;
    cnf: ProcessConfigurations;
    cst: ProcessConfigurations;
}

function mapStateToProps(state: State): IConfigurationTabsProps {
    return {
        chd: state.data.chd,
        cnf: state.data.cnf,
        cst: state.data.cst
    }
}

class ConfigurationTabs extends React.Component<IConfigurationTabsProps,any> {
    constructor() {
        super();
        this.state = {
            codeEditor: false,
            code: "// testCode",
            mode: "markdown"
        };
        this.handleChangeMode = this.handleChangeMode.bind(this);
        this.updateCode = this.updateCode.bind(this);
    }

    private handleChangeMode() {
        this.setState({
            codeEditor: !this.state.codeEditor
        });
    }

    private updateCode(newCode: string) {
        this.setState({
            code: newCode,
        });
    };

    public render() {
        const options = {
            lineNumbers: true,
            mode: this.state.mode
        };

        return (
            <Tabs key="horizontal">
                <TabList>
                    <Tab>Characterization</Tab>
                    <Tab>Configuration</Tab>
                    <Tab>Constants</Tab>
                </TabList>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <label className="pt-control pt-switch">
                            <input type="checkbox" onChange={this.handleChangeMode} checked={this.state.codeEditor}/>
                            <span className="pt-control-indicator"/>
                            Code editor
                        </label>
                        {this.state.codeEditor
                            ?
                            <CodeMirror value={this.state.code} onChange={this.updateCode} options={options}/>
                            :
                            <ConfigurationEditor configurations={this.props.chd}/>
                        }
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <CnfConfigurationEditor configurations={this.props.cnf}/>
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-flexbox-chd">
                        <ConfigurationEditor configurations={this.props.cst}/>
                        <button className="pt-button pt-intent-primary pt-fill">Save Configuration</button>
                    </div>
                </TabPanel>
            </Tabs>
        );
    }
}

export default connect(mapStateToProps)(ConfigurationTabs)
