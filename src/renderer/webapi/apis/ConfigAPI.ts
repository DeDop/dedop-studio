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

export class ConfigAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    getAllConfigs(workspaceName: string): JobPromise<Configuration[]> {
        return this.webAPIClient.call('get_all_configs', [workspaceName], null, configNamesToConfigurations);
    }

    addNewConfig(workspaceName: string, configName: string) {
        return this.webAPIClient.call('add_new_config', [workspaceName, configName], null, null);
    }

    deleteConfig(workspaceName: string, configName: string) {
        return this.webAPIClient.call('delete_config', [workspaceName, configName], null, null);
    }
}
