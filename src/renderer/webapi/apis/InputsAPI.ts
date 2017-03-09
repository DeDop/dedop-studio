import {WebAPIClient} from "../WebAPIClient";
import {JobPromise} from "../Job";
import {Workspace, GlobalAttribute} from "../../state";

function responseToGlobalAttributes(globalAttributesResponse: any): GlobalAttribute[] {
    if (!globalAttributesResponse) {
        return null;
    }
    let globalAttributes: GlobalAttribute[] = [];
    console.log("global attributes from backend", globalAttributesResponse);
    for (let attributeName of Object.keys(globalAttributesResponse)) {
        globalAttributes.push({
            name: attributeName,
            value: globalAttributesResponse[attributeName]
        })
    }
    console.log("global attributes", globalAttributes);
    return globalAttributes;
}

export class InputsAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    addInputFiles(workspaceName: string, inputFilePaths: string[]): JobPromise<Workspace> {
        return this.webAPIClient.call('add_input_files', [workspaceName, inputFilePaths], null, null);
    }

    removeInputFiles(workspaceName: string, inputFileNames: string[]): JobPromise<Workspace> {
        return this.webAPIClient.call('remove_input_files', [workspaceName, inputFileNames], null, null);
    }

    getGlobalAttributes(inputFilePath: string): JobPromise<GlobalAttribute[]> {
        return this.webAPIClient.call('get_global_attributes', [inputFilePath], null, responseToGlobalAttributes);
    }
}
