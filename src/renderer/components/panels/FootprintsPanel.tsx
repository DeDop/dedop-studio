import * as React from "react";
import {CesiumView} from "../cesium/View";
import {FootprintPanelHeader} from "./PanelHeader";

export class FootprintsPanel extends React.Component<any, any> {
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
