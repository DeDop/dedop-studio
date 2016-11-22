import * as React from "react";
import {CesiumView} from "./cesium/view";

export class Footprints extends React.Component<any, any> {
    render() {
        return (
            <div>
                <h4>Footprints</h4>
                <CesiumView id="cesium-viewer"/>
            </div>
        )
    }
}
