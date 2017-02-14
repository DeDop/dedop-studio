import {WebAPIClient} from "../WebAPIClient";
import {JobPromise, JobProgress} from "../Job";
import {Workspace} from "../../state";

function responseToWorkspace(workspaceResponse: any): Workspace {
    if (!workspaceResponse) {
        return null;
    }
    return {
        name: workspaceResponse.name,
        workspaceDir: workspaceResponse.workspace_dir,
        isCurrent: workspaceResponse.is_current,
    };
}

function responseToWorkspaces(workspaceResponse: any): string[] {
    if (!workspaceResponse) {
        return null;
    }
    return workspaceResponse.workspaces;
}

export class WorkspaceAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    newWorkspace(baseDir: string|null): JobPromise<Workspace> {
        return this.webAPIClient.call('new_workspace', [baseDir], null, responseToWorkspace);
    }

    deleteWorkspace(baseDir: string|null): JobPromise<Workspace> {
        return this.webAPIClient.call('delete_workspace', [baseDir]);
    }

    copyWorkspace(baseDir: string,
                  onProgress: (progress: JobProgress) => void): JobPromise<Workspace> {
        return this.webAPIClient.call('copy_workspace', [baseDir], onProgress, responseToWorkspace);
    }

    renameWorkspace(oldWorkspaceName: string, newWorkspaceName: string): JobPromise<null> {
        return this.webAPIClient.call('rename_workspace', [oldWorkspaceName, newWorkspaceName], null, responseToWorkspace);
    }

    getCurrentWorkspace(): JobPromise<Workspace> {
        return this.webAPIClient.call('get_current_workspace', [], null, responseToWorkspace);
    }

    setCurrentWorkspace(newWorkspaceName: string): JobPromise<Workspace> {
        return this.webAPIClient.call('set_current_workspace', [newWorkspaceName], null, responseToWorkspace);
    }

    getAllWorkspaces(): JobPromise<string[]> {
        console.log("inside workspaceapi, before the call");
        return this.webAPIClient.call('get_all_workspaces', [], null, responseToWorkspaces);
    }
}
