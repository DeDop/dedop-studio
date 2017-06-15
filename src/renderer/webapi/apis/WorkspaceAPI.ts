import {WebAPIClient} from "../WebAPIClient";
import {JobProgress, JobPromise} from "../Job";
import {Workspace} from "../../state";

function responseToWorkspace(workspaceResponse: any): Workspace {
    if (!workspaceResponse) {
        return null;
    }
    return {
        name: workspaceResponse.name,
        directory: workspaceResponse.workspace_dir,
        inputs: [],
        configs: []
    };
}

function responseToWorkspaces(workspaceResponse: any): Workspace[] {
    if (!workspaceResponse) {
        return null;
    }
    let workspaces: Workspace[] = [];
    for (let workspace of workspaceResponse.workspaces) {
        workspaces.push({
            name: workspace.name,
            directory: workspace.workspace_dir,
            inputs: [],
            configs: []
        })
    }
    return workspaces;
}

export class WorkspaceAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    newWorkspace(newWorkspaceName: string): JobPromise<Workspace> {
        return this.webAPIClient.call('new_workspace', [newWorkspaceName], null, responseToWorkspace);
    }

    deleteWorkspace(workspaceName: string): JobPromise<Workspace> {
        return this.webAPIClient.call('delete_workspace', [workspaceName]);
    }

    copyWorkspace(oldWorkspaceName: string, newWorkspaceName: string,
                  onProgress: (progress: JobProgress) => void): JobPromise<Workspace> {
        return this.webAPIClient.call('copy_workspace', [oldWorkspaceName, newWorkspaceName], onProgress, responseToWorkspace);
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

    getAllWorkspaces(): JobPromise<Workspace[]> {
        return this.webAPIClient.call('get_all_workspaces', [], null, responseToWorkspaces);
    }
}
