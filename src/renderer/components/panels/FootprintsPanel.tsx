import * as React from "react";
import {CesiumView} from "../cesium/View";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {CesiumPoint, State} from "../../state";
import {connect} from "react-redux";

interface IFootprintsPanel {
    cesiumPoints?: CesiumPoint[];
    isOfflineMode?: boolean;
}

function mapStateToProps(state: State): IFootprintsPanel {
    return {
        cesiumPoints: state.control.cesiumPoints,
        isOfflineMode: state.control.isOfflineMode
    }
}

class FootprintsPanel extends React.Component<IFootprintsPanel, any> {
    render() {
        return (
            <div className="dedop-collapse" style={{height: 'calc(100% - 10px)'}}>
                <OrdinaryPanelHeader title="Footprints" icon="pt-icon-globe"/>
                <div className="dedop-panel-content" style={{height: 'calc(100% - 20px)'}}>
                    <CesiumView id="cesium-viewer"
                                cities={this.props.cesiumPoints}
                                offlineMode={this.props.isOfflineMode}
                    />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(FootprintsPanel);
