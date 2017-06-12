import * as React from "react";
import {ProcessConfigurations, State} from "../../state";
import {Tab2, Tabs2} from "@blueprintjs/core";
import "codemirror/mode/javascript/javascript";
import {connect, Dispatch} from "react-redux";
import {
    saveConfiguration,
    updateConfigEditorMode,
    updateConfigurationTab,
    updateUnsavedConfigStatus
} from "../../actions";
import * as selector from "../../selectors";
import ConfigurationEditorPanel from "../panels/ConfigurationEditorPanel";

interface IConfigurationTabsProps {
    dispatch?: Dispatch<State>;
    chd?: ProcessConfigurations;
    cnf?: ProcessConfigurations;
    cst?: ProcessConfigurations;
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
        this.handleSaveConfig = this.handleSaveConfig.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);

        this.state = {
            chdTemp: this.props.chd,
            cnfTemp: this.props.cnf,
            cstTemp: this.props.cst
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            chdTemp: nextProps.chd,
            cnfTemp: nextProps.cnf,
            cstTemp: nextProps.cst
        });
    }

    private handleChangeMode() {
        this.props.dispatch(updateConfigEditorMode(!this.props.codeEditorActive));
    }

    private handleSaveConfig = () => {
        const chd = this.state.chdTemp;
        const cnf = this.state.cnfTemp;
        const cst = this.state.cstTemp;
        this.props.dispatch(saveConfiguration(this.props.selectedConfigurationName, chd, cnf, cst));
        this.props.dispatch(updateUnsavedConfigStatus(false));
    };

    private handleChangeTab = (selectedTabIndex: number) => {
        this.props.dispatch(updateConfigurationTab(selectedTabIndex));
    };

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
                    <Tab2 id={0} title="Configuration"
                          panel={<ConfigurationEditorPanel codeEditorActive={this.props.codeEditorActive}
                                                           isConfigEditable={this.props.isCnfEditable}
                                                           configType="cnf"/>}
                          className="dedop-config-tab-panel"/>
                    <Tab2 id={1} title="Characterization"
                          panel={<ConfigurationEditorPanel codeEditorActive={this.props.codeEditorActive}
                                                           isConfigEditable={this.props.isChdEditable}
                                                           configType="chd"/>}
                          className="dedop-config-tab-panel"/>
                    <Tab2 id={2} title="Constants"
                          panel={<ConfigurationEditorPanel codeEditorActive={this.props.codeEditorActive}
                                                           isConfigEditable={this.props.isCstEditable}
                                                           configType="cst"/>}
                          className="dedop-config-tab-panel"/>
                </Tabs2>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ConfigurationTabs)
