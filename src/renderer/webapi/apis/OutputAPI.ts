import {WebAPIClient} from "../WebAPIClient";
import {JobPromise} from "../Job";

function response(outputResponse: string[]): string[] {
    return outputResponse ? outputResponse : [];
}

export class OutputAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    get_output_names(workspaceName: string, configName: string): JobPromise<string[]> {
        return this.webAPIClient.call('get_output_names', [workspaceName, configName], null, response);
    }
}
