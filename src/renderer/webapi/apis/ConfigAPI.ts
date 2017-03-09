import {WebAPIClient} from "../WebAPIClient";
import {JobPromise} from "../Job";
import {Workspace, GlobalAttribute, Configuration} from "../../state";

function configNamesToConfigurations(configsNameResponse: any): Configuration[] {
    if (!configsNameResponse) {
        return null;
    }
    let configurations: Configuration[] = [];
    for (let configuration of configsNameResponse) {
        configurations.push({
            name: configuration,
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
}
