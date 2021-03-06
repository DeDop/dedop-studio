import * as React from "react";
import {IPermanentComponentProps, PermanentComponent} from "../util/PermanentComponent";
import {CesiumPoint} from "../../state";

const Cesium: any = require('cesium');
// console.log(Cesium);
const BuildModuleUrl: any = Cesium.buildModuleUrl;
BuildModuleUrl.setBaseUrl('./');
const CesiumViewer: any = Cesium.Viewer;
const Entity: any = Cesium.Entity;
const Cartesian3: any = Cesium.Cartesian3;

interface CesiumViewer {
    container: HTMLElement;
    entities: any;
    camera: any;
}

// TODO: only used to get electron.app.getAppPath
const {app} = require('electron').remote;

// Bing Maps Key associated with Account Id 1441410 (= norman.fomferra@brockmann-consult.de)
// * Application Name: CCI Toolbox
// * Key / Application Type: Basic / Dev/Test
// * Application URL: http://cci.esa.int/
//
Cesium.BingMapsApi.defaultKey = 'AnCcpOxnAAgq-KyFcczSZYZ_iFvCOmWl0Mx-6QzQ_rzMtpgxZrPZZNxa8_9ZNXci';

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(4.1, 52, 4.6, 52.5);
Cesium.Camera.DEFAULT_VIEW_FACTOR = 1;


export interface ICesiumComponentProps extends IPermanentComponentProps {
    id: string;
    offlineMode?: boolean;
    cesiumPoints?: Array<any>;
}

export class CesiumComponent extends PermanentComponent<CesiumViewer, ICesiumComponentProps, any> {

    constructor(props: ICesiumComponentProps) {
        super(props);
    }

    get viewer(): CesiumViewer {
        return this.permanentObject;
    }

    createPermanentObject(): CesiumViewer {
        let container = this.createContainer();

        let baseLayerImageryProvider;
        if (this.props.offlineMode) {
            const baseUrl = Cesium.buildModuleUrl('');
            baseLayerImageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: baseUrl + 'Assets/Textures/NaturalEarthII/{z}/{x}/{reverseY}.jpg',
                tilingScheme: new Cesium.GeographicTilingScheme(),
                minimumLevel: 0,
                maximumLevel: 2,
                credit: 'Natural Earth II: Tileset Copyright © 2012-2014 Analytical Graphics, Inc. (AGI). Original data courtesy Natural Earth and in the public domain.'
            });
        } else {
            baseLayerImageryProvider = new Cesium.BingMapsImageryProvider({
                url: 'http://dev.virtualearth.net'
            });
        }

        const cesiumViewerOptions = {
            animation: false,
            baseLayerPicker: false,
            selectionIndicator: true,
            fullscreenButton: false,
            geocoder: false,
            homeButton: true,
            infoBox: true,
            sceneModePicker: true,
            timeline: false,
            navigationHelpButton: true,
            creditContainer: 'creditContainer',
            imageryProvider: baseLayerImageryProvider,
            navigationInstructionsInitiallyVisible: false,
            automaticallyTrackDataSourceClocks: false,
        };

        // Create the Cesium Viewer
        let viewer = new CesiumViewer(container, cesiumViewerOptions);

        // Add the initial points
        this.addNewEntities(viewer, this.props.cesiumPoints);

        return viewer;
    }

    private addNewEntities(viewer: any, cesiumPoints: CesiumPoint[]) {
        if (cesiumPoints.length > 0) {
            viewer.entities.suspendEvents();
            const lastIndex = cesiumPoints.length - 1;
            const material = new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.ORANGE,
            });
            viewer.entities.add(new Entity({
                id: 0,
                name: "Data footprint",
                show: true,
                position: new Cartesian3.fromDegrees(cesiumPoints[0].longitude, cesiumPoints[0].latitude),
                polyline: {
                    positions: [Cesium.Cartesian3.fromDegrees(cesiumPoints[0].longitude, cesiumPoints[0].latitude),
                        Cesium.Cartesian3.fromDegrees(cesiumPoints[lastIndex].longitude, cesiumPoints[lastIndex].latitude)],
                    material: material,
                    width: 3.0
                }
            }));
            viewer.entities.resumeEvents();
        }
    }

    componentWillReceiveProps(nextProps: ICesiumComponentProps) {
        console.log("CesiumComponent.componentWillReceiveProps()");
        const currCesiumPoints = this.props.cesiumPoints;
        const nextCesiumPoints = nextProps.cesiumPoints;
        if (currCesiumPoints.length == nextCesiumPoints.length
            && currCesiumPoints[0].latitude == nextCesiumPoints[0].latitude
            && currCesiumPoints[0].longitude == nextCesiumPoints[0].longitude
            && currCesiumPoints[1].latitude == nextCesiumPoints[1].latitude
            && currCesiumPoints[1].longitude == nextCesiumPoints[1].longitude
        ) {
            const patches = CesiumComponent.calculatePatches(this.props, nextProps);
            // Map patch operations to Cesium's Entity API
            patches.forEach((patch) => {
                if (patch.attribute === 'visible') {
                    this.viewer.entities.getById(patch.id).show = patch.nextValue;
                }
                // else if (patch.attribute === 'name') { .. and so on .. }
            });
        } else if (nextCesiumPoints.length > 0) {
            this.viewer.entities.removeAll();
            this.addNewEntities(this.viewer, nextCesiumPoints);
            this.viewer.camera.flyTo({
                destination: new Cartesian3.fromDegrees(nextCesiumPoints[0].longitude, nextCesiumPoints[0].latitude, 1500000.0)
            });
        } else {
            this.viewer.entities.removeAll();
            this.viewer.camera.flyTo({
                destination: new Cartesian3.fromDegrees(20.0, 35.0, 15000000.0)
            })
        }
    }

    private static calculatePatches(currentProps: ICesiumComponentProps, nextProps: ICesiumComponentProps) {
        const patches = [];

        currentProps.cesiumPoints.forEach((currPoint, index) => {
            let nextPoint = nextProps.cesiumPoints[index];

            if (currPoint.visible !== nextPoint.visible) {
                patches.push({
                    id: currPoint.id,
                    attribute: 'visible',
                    nextValue: nextPoint.visible
                });
            }
            // else if (currPoint.name !== nextPoint.name) { .. and so on .. }
        });

        return patches;
    }

    private createContainer(): HTMLElement {
        const div = document.createElement("div");
        div.setAttribute("id", "cesium-container-" + this.props.id);
        div.setAttribute("class", "cesium-container");
        return div;
    }
}
