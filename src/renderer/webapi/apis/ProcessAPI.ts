import {WebAPIClient} from "../WebAPIClient";
import {JobPromise, JobProgress} from "../Job";
import {Workspace} from "../../state";

export class ProcessAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    process(processName: string, workspaceName: string, configName: string, outputPath: string, l1aFilePath: string,
            onProgress: (progress: JobProgress) => void): JobPromise<Workspace> {
        return this.webAPIClient.call('process', [processName, workspaceName, configName, outputPath, l1aFilePath], onProgress, null);
    }
}
