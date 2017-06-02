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

    remove_output_files(workspaceName: string, configName: string) {
        return this.webAPIClient.call('remove_output_files', [workspaceName, configName], null, null);
    }

    inspect_output(workspaceName: string, outputFilePath: string) {
        return this.webAPIClient.call('inspect_output', [workspaceName, outputFilePath], null, null);
    }

    compare_outputs(workspaceName: string, output1FilePath: string, output2FilePath: string) {
        return this.webAPIClient.call('compare_outputs', [workspaceName, output1FilePath, output2FilePath], null, null);
    }

    get_notebook_file_names(workspaceName: string): JobPromise<string[]> {
        return this.webAPIClient.call('get_notebook_file_names', [workspaceName], null, response);
    }

    launch_notebook(workspaceName: string, notebookName: string){
        return this.webAPIClient.call('launch_notebook', [workspaceName, notebookName], null, null);
    }
}
