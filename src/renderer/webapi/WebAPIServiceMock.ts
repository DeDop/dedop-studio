import {IProcessData, IServiceObject} from "./WebSocketMock";
import {Workspace} from "../state";

/**
 * Simulates the a local/remote WebAPIClient service.
 * Mimics a local/remote webservice usually running on a Python Tornado.
 */
export class WebAPIServiceMock implements IServiceObject {
    mockWorkspaces = {
        workspaces: [
            "ws1",
            "ws2",
            "ws3"
        ]
    };
    mockCurrentWorkspace: Workspace = {
        name: "ws1",
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
        return Object.assign({}, this.mockWorkspaces, {
            workspaces: [
                this.mockWorkspaces.workspaces.slice(0, index),
                this.mockWorkspaces.workspaces.slice(index + 1)
            ]
        });
    }

    get_all_workspaces(): Object {
        return this.mockWorkspaces
    }

    get_current_workspace(): Workspace {
        return this.mockCurrentWorkspace
    }
}
