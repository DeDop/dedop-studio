import {WebAPIClient} from '../WebAPIClient';
import {JobPromise} from '../Job';
import {Configuration, ProcessConfigurations} from '../../state';
import * as moment from 'moment';

function configNamesToConfigurations(configsNameResponse: any): Configuration[] {
    if (!configsNameResponse) {
        return null;
    }
    let configurations: Configuration[] = [];
    const currentTime = moment().format('DD/MM/YY, hh:mm:ss');
    for (let configuration of configsNameResponse) {
        configurations.push({
            name: configuration,
            lastUpdated: currentTime
        })
    }
    return configurations;
}

function responseToConfigName(configNameResponse: any): string {
    if (configNameResponse.name == '') {
        return null;
    }
    return configNameResponse.name;
}

function responseToConfigurations(configurationsResponse): Configuration {
    function restoreOrder(configuration: ProcessConfigurations, order: string[]) {
        let reorderedConfiguration: ProcessConfigurations = {};
        for (let key of order) {
            reorderedConfiguration[key] = configuration[key]
        }
        return reorderedConfiguration;
    }

    const sortedChd: ProcessConfigurations = configurationsResponse.chd ? restoreOrder(configurationsResponse.chd, configurationsResponse.chd_order) : {};
    const sortedCnf: ProcessConfigurations = configurationsResponse.cnf ? restoreOrder(configurationsResponse.cnf, configurationsResponse.cnf_order) : {};
    const sortedCst: ProcessConfigurations = configurationsResponse.cst ? restoreOrder(configurationsResponse.cst, configurationsResponse.cst_order) : {};
    return Object.assign({}, configurationsResponse, {
        chd: sortedChd,
        cnf: sortedCnf,
        cst: sortedCst,
    });
}

function responseToConfigurationVersions(versions: any): { chdVersion: number, cnfVersion: number, cstVersion: number } {
    return {
        chdVersion: versions.chd_version,
        cnfVersion: versions.cnf_version,
        cstVersion: versions.cst_version
    }
}

export class ConfigAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    getConfigNames(workspaceName: string): JobPromise<Configuration[]> {
        return this.webAPIClient.call('get_config_names', [workspaceName], null, configNamesToConfigurations);
    }

    addNewConfig(workspaceName: string, configName: string, configType: string) {
        return this.webAPIClient.call('add_new_config', [workspaceName, configName, configType === 'cryosat2'], null, null);
    }

    deleteConfig(workspaceName: string, configName: string) {
        return this.webAPIClient.call('delete_config', [workspaceName, configName], null, null);
    }

    copyConfig(workspaceName: string, configName: string, newConfigName: string) {
        return this.webAPIClient.call('copy_config', [workspaceName, configName, newConfigName], null, null);
    }

    renameConfig(workspaceName: string, configName: string, newConfigName: string) {
        return this.webAPIClient.call('rename_config', [workspaceName, configName, newConfigName], null, null);
    }

    getCurrentConfig(workspaceName: string) {
        return this.webAPIClient.call('get_current_config', [workspaceName], null, responseToConfigName);
    }

    setCurrentConfig(workspaceName: string, configName: string) {
        return this.webAPIClient.call('set_current_config', [workspaceName, configName], null, null);
    }

    getConfigs(workspaceName: string, configName: string): JobPromise<Configuration> {
        return this.webAPIClient.call('get_configs', [workspaceName, configName], null, responseToConfigurations);
    }

    saveConfigs(workspaceName: string, configName: string, configurations: { chd: ProcessConfigurations, cnf: ProcessConfigurations, cst: ProcessConfigurations }) {
        return this.webAPIClient.call('save_configs', [workspaceName, configName, configurations], null, null);
    }

    getDefaultConfigVersions(): JobPromise<{ chdVersion: number, cnfVersion: number, cstVersion: number }> {
        return this.webAPIClient.call('get_default_config_versions', [], null, responseToConfigurationVersions);
    }

    upgradeConfigs(workspaceName: string, configName: string): JobPromise<Configuration> {
        return this.webAPIClient.call('upgrade_configs', [workspaceName, configName], null, responseToConfigurations);
    }
}
