import {WebAPIClient} from "../WebAPIClient";
import {JobPromise, JobProgress} from "../Job";
import {Workspace, Workspaces} from "../../state";

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

function responseToWorkspaces(workspaceResponse: any): Workspaces {
    if (!workspaceResponse) {
        return null;
    }
    return {
        workspaces: workspaceResponse.workspaces
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

    deleteWorkspace(baseDir: string|null): JobPromise<Workspace> {
        return this.webAPIClient.call('delete_workspace', [baseDir]);
    }

    copyWorkspace(baseDir: string,
                  onProgress: (progress: JobProgress) => void): JobPromise<Workspace> {
        return this.webAPIClient.call('copy_workspace', [baseDir], onProgress, responseToWorkspace);
    }

    renameWorkspace(baseDir: string): JobPromise<null> {
        return this.webAPIClient.call('rename_workspace', [baseDir], null, responseToWorkspace);
    }

    getCurrentWorkspace(baseDir: string): JobPromise<Workspace> {
        return this.webAPIClient.call('get_current_workspace', [baseDir], null, responseToWorkspace);
    }

    setCurrentWorkspace(baseDir: string, toDir: string): JobPromise<Workspace> {
        return this.webAPIClient.call('set_current_workspace', [baseDir, toDir], null, responseToWorkspace);
    }

    getAllWorkspaces(baseDir: string, toDir: string): JobPromise<Workspaces> {
        return this.webAPIClient.call('set_current_workspace', [baseDir, toDir], null, responseToWorkspaces);
    }
}
