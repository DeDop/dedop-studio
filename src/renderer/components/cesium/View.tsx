import * as React from "react";
import {CesiumComponent} from "./Cesium";
import {CesiumPoint, State} from "../../state";
import {connect} from "react-redux";
import * as selector from "../../selectors";

interface ICesiumViewOwnProps {
    id: string;
}

interface ICesiumViewProps {
    cesiumPoints?: CesiumPoint[];
    isOfflineMode?: boolean;
    id: string;
}

function mapStateToProps(state: State, ownProps: ICesiumViewOwnProps): ICesiumViewProps {
    return {
        cesiumPoints: selector.getCesiumPoints(state),
        isOfflineMode: state.control.isOfflineMode,
        id: ownProps.id
    }
}

class CesiumView extends React.Component<ICesiumViewProps & ICesiumViewOwnProps, any> {
    constructor(props: ICesiumViewProps) {
        super(props);
        //noinspection JSFileReferences
    }

    private handleCheckboxChange(event) {
        let cesiumPoints = this.props.cesiumPoints;
        let newCities = cesiumPoints.map((cesiumPoint) => {
            let visible = (cesiumPoint.id === event.target.value) ? event.target.checked : cesiumPoint.visible;
            return {
                id: cesiumPoint.id,
                name: cesiumPoint.name,
                latitude: cesiumPoint.latitude,
                longitude: cesiumPoint.longitude,
                visible: visible
            }
        });
        this.setState({
            cities: newCities
        })
    }

    render() {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <CesiumComponent id={this.props.id} debug={true} style={{width: "100%", height: "100%"}}
                                 cesiumPoints={this.props.cesiumPoints} offlineMode={this.props.isOfflineMode}/>
                {/*<CesiumCityList cities={this.state.cities} onChange={this.handleCheckboxChange.bind(this)}/>*/}
                <div id="creditContainer" style={{display: "none"}}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(CesiumView)
