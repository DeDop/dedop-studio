import * as React from "react";
import {CesiumView} from "../cesium/View";
import {OrdinaryPanelHeader} from "./PanelHeader";

export class FootprintsPanel extends React.Component<any, any> {
    render() {
        return (
            <div className="dedop-collapse">
                <OrdinaryPanelHeader title="Footprints" icon="pt-icon-globe"/>
                <div className="dedop-panel-content">
                    <CesiumView id="cesium-viewer"/>
                </div>
            </div>
        )
    }
}
