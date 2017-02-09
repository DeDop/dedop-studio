import {IProcessData, IServiceObject} from "./WebSocketMock";

/**
 * Simulates the a local/remote WebAPIClient service.
 * Mimics a local/remote webservice usually running on a Python Tornado.
 */
export class WebAPIServiceMock implements IServiceObject {
    workspaces = {};
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

    test_action(param1: string) {
        return {
            status: "ok",
            content: "successful test",
            arg: param1
        };
    }
}
