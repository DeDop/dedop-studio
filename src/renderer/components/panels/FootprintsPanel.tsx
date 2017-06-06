import * as React from "react";
import {CesiumView} from "../cesium/View";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {CesiumPoint, State} from "../../state";
import {connect} from "react-redux";

interface IFootprintsPanel {
    cesiumPoints?: CesiumPoint[];
}

function mapStateToProps(state: State): IFootprintsPanel {
    return {
        cesiumPoints: state.control.cesiumPoints
    }
}

class FootprintsPanel extends React.Component<IFootprintsPanel, any> {
    render() {
        return (
            <div className="dedop-collapse">
                <OrdinaryPanelHeader title="Footprints" icon="pt-icon-globe"/>
                <div className="dedop-panel-content">
                    <CesiumView id="cesium-viewer"
                                cities={this.props.cesiumPoints}/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(FootprintsPanel);
