import {WebAPIClient} from "../WebAPIClient";
import {JobPromise} from "../Job";

function responseToWorkspace(workspaceResponse: any): string {
    if (!workspaceResponse) {
        return null;
    }
    return workspaceResponse.arg;
}

export class TestAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    testAction(): JobPromise<string> {
        return this.webAPIClient.call('test_action', ["Hello world!"], null, responseToWorkspace);
    }
}
