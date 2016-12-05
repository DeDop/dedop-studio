import * as React from "react";
import {CesiumView} from "./cesium/view";
import {FootprintPanelHeader} from "./panelHeader";

export class Footprints extends React.Component<any, any> {
    render() {
        return (
            <div className="dedop-collapse">
                <FootprintPanelHeader/>
                <div className="dedop-panel-content">
                    <CesiumView id="cesium-viewer"/>
                </div>
            </div>
        )
    }
}
