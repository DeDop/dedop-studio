import {WebAPIClient} from "../WebAPIClient";
import {JobPromise} from "../Job";
import {Configuration, ConfigurationDescriptor, ProcessConfigurations} from "../../state";
import * as moment from "moment";

function configNamesToConfigurations(configsNameResponse: any): Configuration[] {
    if (!configsNameResponse) {
        return null;
    }
    let configurations: Configuration[] = [];
    const currentTime = moment().format("DD/MM/YY, hh:mm:ss");
    for (let configuration of configsNameResponse) {
        configurations.push({
            name: configuration,
            lastUpdated: currentTime
        })
    }
    return configurations;
}

function responseToConfigName(configNameResponse: any): string {
    if (configNameResponse.name == "") {
        return null;
    }
    return configNameResponse.name;
}

function responseToConfigurations(configurationsResponse): Configuration {
    function sort(configuration: ProcessConfigurations) {
        let sortedConfiguration: ProcessConfigurations = {};
        Object.keys(configuration).sort().forEach((key) => {
            sortedConfiguration[key] = configuration[key];
        });
        return sortedConfiguration;
    }

    const sortedChd: ProcessConfigurations = configurationsResponse.chd ? sort(configurationsResponse.chd) : {};
    const sortedCnf: ProcessConfigurations = configurationsResponse.cnf ? sort(configurationsResponse.cnf) : {};
    const sortedCst: ProcessConfigurations = configurationsResponse.cst ? sort(configurationsResponse.cst) : {};
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

function responseToConfigurationDescriptors(descriptors): { chdDescriptor: ConfigurationDescriptor, cnfDescriptor: ConfigurationDescriptor, cstDescriptor: ConfigurationDescriptor } {
    let chdDescriptor = null;
    console.log("inside responseToConfigurationDescriptors1", descriptors);
    for (let paramName of Object.keys(descriptors.chd_descriptor)) {
        if (paramName == "__metainf__") {
            chdDescriptor = Object.assign({}, chdDescriptor, {
                metainf: descriptors[paramName]
            });
            continue;
        }
        let newParameters=[];
        if (chdDescriptor && chdDescriptor.parameters) {
            newParameters = Object.assign({}, chdDescriptor.parameters);
            newParameters[paramName] = descriptors[paramName];
        } else {
            let newParameter = [];
            newParameters[paramName]
        }
        newParameters[paramName] = descriptors[paramName];
        chdDescriptor = Object.assign({}, chdDescriptor, {
            parameters: newParameters
        });
        console.log("inside responseToConfigurationDescriptors2", chdDescriptor);
    }
    return {
        chdDescriptor: chdDescriptor,
        cnfDescriptor: chdDescriptor,
        cstDescriptor: chdDescriptor,
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

    addNewConfig(workspaceName: string, configName: string) {
        return this.webAPIClient.call('add_new_config', [workspaceName, configName], null, null);
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

    getConfigDescriptors(): JobPromise<{ chdDescriptor: ConfigurationDescriptor, cnfDescriptor: ConfigurationDescriptor, cstDescriptor: ConfigurationDescriptor }> {
        return this.webAPIClient.call('get_config_descriptors', [], null, responseToConfigurationDescriptors);
    }

    getDefaultConfigVersions(): JobPromise<{ chdVersion: number, cnfVersion: number, cstVersion: number }> {
        return this.webAPIClient.call('get_default_config_versions', [], null, responseToConfigurationVersions);
    }

    upgradeConfigs(workspaceName: string, configName: string): JobPromise<Configuration> {
        return this.webAPIClient.call('upgrade_configs', [workspaceName, configName], null, responseToConfigurations);
    }
}
