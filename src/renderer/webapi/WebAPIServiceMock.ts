import {IProcessData, IServiceObject} from "./WebSocketMock";
import {Workspace} from "../state";

/**
 * Simulates the a local/remote WebAPIClient service.
 * Mimics a local/remote webservice usually running on a Python Tornado.
 */
export class WebAPIServiceMock implements IServiceObject {
    mockWorkspaces = {
        workspaces: [
            "workspace1",
            "workspace2",
            "workspace3"
        ]
    };
    mockCurrentWorkspace: Workspace = {
        name: "workspace1",
        workspaceDir: "mockDir",
        isCurrent: true
    };
    workspaceId = 0;

    // processData is picked up by WebSocketMock
    processData: {[methodName: string]: IProcessData} = {
        test_action: {
            numSteps: 10,
            delayPerStep: 1000,
            delay: 500
        },
    };

    constructor() {
    }

    new_workspace(new_workspace_name: string): Workspace {
        this.mockWorkspaces = Object.assign({}, this.mockWorkspaces, {
            workspaces: [
                ...this.mockWorkspaces.workspaces,
                new_workspace_name
            ]
        });
        return {
            name: new_workspace_name,
            workspaceDir: "mockDir",
            isCurrent: false
        }
    }

    delete_workspace(workspace_name: string) {
        const index = this.mockWorkspaces.workspaces.findIndex((x) => x == workspace_name);
        this.mockWorkspaces = Object.assign({}, this.mockWorkspaces, {
            workspaces: [
                ...this.mockWorkspaces.workspaces.slice(0, index),
                ...this.mockWorkspaces.workspaces.slice(index + 1)
            ]
        });
        if (this.mockCurrentWorkspace.name == workspace_name) {
            if (this.mockWorkspaces.workspaces.length > 0) {
                this.mockCurrentWorkspace.name = this.mockWorkspaces.workspaces[0];
            } else {
                this.mockCurrentWorkspace.name = "";
            }
        }
        return {}
    }

    copy_workspace(old_workspace_name: string, new_workspace_name: string): Workspace {
        const newWorkspace: Workspace = {
            name: new_workspace_name,
            workspaceDir: "mockDir",
            isCurrent: false
        };
        this.mockWorkspaces.workspaces = [
            ...this.mockWorkspaces.workspaces,
            newWorkspace.name
        ];
        return newWorkspace
    }

    rename_workspace(old_workspace_name: string, new_workspace_name: string): Workspace {
        const newWorkspace: Workspace = {
            name: new_workspace_name,
            workspaceDir: "mockDir",
            isCurrent: false
        };
        const index = this.mockWorkspaces.workspaces.findIndex((x) => x == old_workspace_name);
        if (index < 0) {
            throw Error(`Workspace '${old_workspace_name}' cannot be found`)
        }
        this.mockWorkspaces = Object.assign({}, this.mockWorkspaces, {
            workspaces: [
                ...this.mockWorkspaces.workspaces.slice(0, index),
                newWorkspace.name,
                ...this.mockWorkspaces.workspaces.slice(index + 1)
            ]
        });
        return newWorkspace;
    }

    get_current_workspace(): Workspace {
        return this.mockCurrentWorkspace
    }

    set_current_workspace(new_workspace_name: string): Workspace {
        if (this.mockWorkspaces.workspaces.indexOf(new_workspace_name) < 0) {
            throw Error(`Workspace '${new_workspace_name}' cannot be found`)
        }
        this.mockCurrentWorkspace = {
            name: new_workspace_name,
            workspaceDir: "mockDir",
            isCurrent: true
        };
        return this.mockCurrentWorkspace
    }

    get_all_workspaces(): Object {
        return this.mockWorkspaces
    }
}
