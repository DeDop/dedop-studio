import {WebAPIClient} from "../WebAPIClient";
import {JobPromise} from "../Job";
import {Configuration} from "../../state";
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
    return configurationsResponse;
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
}
