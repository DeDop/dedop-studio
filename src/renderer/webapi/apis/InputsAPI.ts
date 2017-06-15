import {WebAPIClient} from "../WebAPIClient";
import {JobPromise} from "../Job";
import {Workspace, GlobalAttribute, CesiumPoint} from "../../state";

function responseToGlobalAttributes(globalAttributesResponse: any): GlobalAttribute[] {
    if (!globalAttributesResponse) {
        return null;
    }
    let globalAttributes: GlobalAttribute[] = [];
    for (let attributeName of Object.keys(globalAttributesResponse)) {
        globalAttributes.push({
            name: attributeName,
            value: globalAttributesResponse[attributeName]
        })
    }
    return globalAttributes;
}

function responseToCesiumPoints(latLonResponse: {lat: number[], lon: number[]}): CesiumPoint[] {
    if (!latLonResponse) {
        return [];
    }
    if (latLonResponse.lat.length != latLonResponse.lon.length) {
        throw Error("latitude and longitude have different length");
    }
    let cesiumPoints: CesiumPoint[] = [];
    for (let i in latLonResponse.lat) {
        cesiumPoints.push({
            id: parseInt(i),
            name: "Record ".concat((parseInt(i) + 1).toString()),
            latitude: latLonResponse.lat[i],
            longitude: latLonResponse.lon[i],
            visible: true
        })
    }
    return cesiumPoints;
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

    getLatLon(inputFilePath: string): JobPromise<CesiumPoint[]> {
        return this.webAPIClient.call('get_lat_lon', [inputFilePath], null, responseToCesiumPoints);
    }

    getMaxMinCoordinates(inputFilePath: string): JobPromise<CesiumPoint[]> {
        return this.webAPIClient.call('get_max_min_coordinates', [inputFilePath], null, responseToCesiumPoints);
    }
}
