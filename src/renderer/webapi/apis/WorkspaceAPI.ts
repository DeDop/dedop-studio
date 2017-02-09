import {WebAPIClient} from "../WebAPIClient";
import {JobPromise, JobProgress} from "../Job";
import {Workspace} from "../../state";

function responseToWorkspace(workspaceResponse: any): Workspace {
    if (!workspaceResponse) {
        return null;
    }
    return {
        name: workspaceResponse.name,
        baseDir: workspaceResponse.base_dir,
        isSaved: workspaceResponse.is_saved,
    };
}

export class WorkspaceAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    newWorkspace(baseDir: string|null): JobPromise<Workspace> {
        return this.webAPIClient.call('new_workspace', [baseDir], null, responseToWorkspace);
    }

    openWorkspace(baseDir: string,
                  onProgress: (progress: JobProgress) => void): JobPromise<Workspace> {
        return this.webAPIClient.call('open_workspace', [baseDir], onProgress, responseToWorkspace);
    }

    closeWorkspace(baseDir: string): JobPromise<null> {
        return this.webAPIClient.call('close_workspace', [baseDir]);
    }

    saveWorkspace(baseDir: string): JobPromise<Workspace> {
        return this.webAPIClient.call('save_workspace', [baseDir], null, responseToWorkspace);
    }

    saveWorkspaceAs(baseDir: string, toDir: string,
                    onProgress: (progress: JobProgress) => void): JobPromise<Workspace> {
        return this.webAPIClient.call('save_workspace_as', [baseDir, toDir], onProgress, responseToWorkspace);
    }

    setWorkspaceResource(baseDir: string, resName: string, opName: string, opArgs: {[name: string]: any},
                         onProgress: (progress: JobProgress) => void): JobPromise<Workspace> {
        return this.webAPIClient.call('set_workspace_resource', [baseDir, resName, opName, opArgs],
            onProgress, responseToWorkspace);
    }
}
