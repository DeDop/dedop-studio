import * as React from 'react';
import {ProcessConfigurations, State} from '../../state';
import {Tab2, Tabs2} from '@blueprintjs/core';
import {connect, Dispatch} from 'react-redux';
import * as selector from '../../selectors';
import {
    saveConfiguration,
    updateConfigEditorMode,
    updateConfigurationTab,
    updateUnsavedConfigStatus
} from '../../actions';
import ConfigurationEditorPanel from '../panels/ConfigurationEditorPanel';

interface IConfigurationTabsProps {
    dispatch?: Dispatch<State>;
    codeEditorActive?: boolean;
    selectedConfigurationName?: string;
    currentTab?: number;
    unsavedConfigChanges?: boolean;
    isCnfEditable?: boolean;
    isChdEditable?: boolean;
    isCstEditable?: boolean;
    chd?: ProcessConfigurations;
    cnf?: ProcessConfigurations;
    cst?: ProcessConfigurations;
    chdTemp: ProcessConfigurations;
    cnfTemp: ProcessConfigurations;
    cstTemp: ProcessConfigurations;
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
        chdTemp: state.control.chdTemp,
        cnfTemp: state.control.cnfTemp,
        cstTemp: state.control.cstTemp
    }
}

class ConfigurationTabs extends React.Component<IConfigurationTabsProps, any> {
    constructor(props) {
        super(props);
        this.handleChangeMode = this.handleChangeMode.bind(this);
        this.handleSaveConfig = this.handleSaveConfig.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

    private handleChangeMode() {
        this.props.dispatch(updateConfigEditorMode(!this.props.codeEditorActive));
    }

    private handleSaveConfig = () => {
        this.props.dispatch(saveConfiguration(
            this.props.selectedConfigurationName,
            this.props.chdTemp ? this.props.chdTemp : this.props.chd,
            this.props.cnfTemp ? this.props.cnfTemp : this.props.cnf,
            this.props.cstTemp ? this.props.cstTemp : this.props.cst));
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
