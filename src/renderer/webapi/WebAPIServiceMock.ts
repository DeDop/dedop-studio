import {IProcessData, IServiceObject} from "./WebSocketMock";
import {Workspace} from "../state";

/**
 * Simulates the a local/remote WebAPIClient service.
 * Mimics a local/remote webservice usually running on a Python Tornado.
 */
export class WebAPIServiceMock implements IServiceObject {
    mockWorkspaces: Workspace[] = [
        {
            name: "workspace1",
            inputs: [],
            configs: []
        },
        {
            name: "workspace2",
            inputs: [],
            configs: []
        },
        {
            name: "workspace3",
            inputs: [],
            configs: []
        }];
    mockCurrentWorkspace: Workspace = {
        name: "workspace1",
        inputs: [],
        configs: []
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
        const newWorkspace = {
            name: new_workspace_name,
            inputs: [],
            configs: []
        };
        this.mockWorkspaces =
            [
                ...this.mockWorkspaces,
                newWorkspace
            ];
        return newWorkspace;
    }

    delete_workspace(workspace_name: string) {
        const index = this.mockWorkspaces.findIndex((x) => x.name == workspace_name);
        this.mockWorkspaces = [
            ...this.mockWorkspaces.slice(0, index),
            ...this.mockWorkspaces.slice(index + 1)
        ];
        if (this.mockCurrentWorkspace.name == workspace_name) {
            if (this.mockWorkspaces.length > 0) {
                this.mockCurrentWorkspace.name = this.mockWorkspaces[0].name;
            } else {
                this.mockCurrentWorkspace.name = "";
            }
        }
        return {}
    }

    copy_workspace(old_workspace_name: string, new_workspace_name: string): Workspace {
        const newWorkspace: Workspace = {
            name: new_workspace_name
        };
        this.mockWorkspaces = [
            ...this.mockWorkspaces,
            {
                name: newWorkspace.name,
                inputs: [],
                configs: []
            }
        ];
        return newWorkspace
    }

    rename_workspace(old_workspace_name: string, new_workspace_name: string): Workspace {
        const newWorkspace: Workspace = {
            name: new_workspace_name,
            inputs: [],
            configs: []
        };
        const index = this.mockWorkspaces.findIndex((x) => x.name == old_workspace_name);
        if (index < 0) {
            throw Error(`Workspace '${old_workspace_name}' cannot be found`)
        }
        this.mockWorkspaces =
            [
                ...this.mockWorkspaces.slice(0, index),
                newWorkspace,
                ...this.mockWorkspaces.slice(index + 1)
            ];
        return newWorkspace;
    }

    get_current_workspace(): Workspace {
        return this.mockCurrentWorkspace
    }

    set_current_workspace(new_workspace_name: string): Workspace {
        const index = this.mockWorkspaces.findIndex((x) => x.name == new_workspace_name);
        if (index < 0) {
            throw Error(`Workspace '${new_workspace_name}' cannot be found`)
        }
        this.mockCurrentWorkspace = {
            name: new_workspace_name,
            inputs: [],
            configs: []
        };
        return this.mockCurrentWorkspace
    }

    get_all_workspaces(): Object {
        return this.mockWorkspaces
    }

    add_input_files(workspaceName: string, inputFilePaths: string[]) {

    }
}
