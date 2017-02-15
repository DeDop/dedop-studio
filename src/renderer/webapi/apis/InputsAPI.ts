import {WebAPIClient} from "../WebAPIClient";
import {JobPromise, JobProgress} from "../Job";
import {Workspace} from "../../state";

export class InputsAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    addInputFiles(workspaceName: string, inputFilePaths: string[]): JobPromise<Workspace> {
        return this.webAPIClient.call('add_input_files', [workspaceName, inputFilePaths], null, null);
    }
}
