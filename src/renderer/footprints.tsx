import * as React from "react";
import {CesiumView} from "./cesium/view";

export class Footprints extends React.Component<any, any> {
    render() {
        return (
            <div className="dedop-collapse">
                <div className="dedop-collapse-header">
                    <span className="dedop-collapse-header-icon pt-icon-standard pt-icon-globe"/>
                    <span className="dedop-collapse-header-text">Footprints</span>
                </div>
                <div className="dedop-panel-content">
                    <CesiumView id="cesium-viewer"/>
                </div>
            </div>
        )
    }
}
