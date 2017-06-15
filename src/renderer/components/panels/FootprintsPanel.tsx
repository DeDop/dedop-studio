import * as React from "react";
import CesiumView from "../cesium/View";
import {OrdinaryPanelHeader} from "./PanelHeader";

export class FootprintsPanel extends React.Component<any, any> {
    render() {
        return (
            <div className="dedop-collapse" style={{height: 'calc(100% - 10px)'}}>
                <OrdinaryPanelHeader title="Footprints" icon="pt-icon-globe"/>
                <div className="dedop-panel-content" style={{height: 'calc(100% - 20px)'}}>
                    <CesiumView id="cesium-viewer"/>
                </div>
            </div>
        )
    }
}
