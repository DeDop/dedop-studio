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

    inspect_output(workspaceName: string, outputFilePath: string) {
        return this.webAPIClient.call('inspect_output', [workspaceName, outputFilePath], null, null);
    }
}
