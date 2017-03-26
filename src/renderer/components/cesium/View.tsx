import * as React from "react";
import {CesiumComponent} from "./Cesium";
import {CesiumPoint} from "../../state";

// TODO: only used to get electron.app.getAppPath
const {app} = require('electron').remote;

interface ICesiumViewProps {
    id: string;
    cities: CesiumPoint[];
}

export class CesiumView extends React.Component<ICesiumViewProps, any> {
    constructor(props: ICesiumViewProps) {
        super(props);
        //noinspection JSFileReferences
    }

    private handleCheckboxChange(event) {
        let cities = this.props.cities;
        let newCities = cities.map((city) => {
            let visible = (city.id === event.target.value) ? event.target.checked : city.visible;
            return {
                id: city.id,
                name: city.name,
                latitude: city.latitude,
                longitude: city.longitude,
                visible: visible
            }
        });
        this.setState({
            cities: newCities
        })
    }

    render() {
        return (
            <div style={{width:"100%", height:"100%"}}>
                <CesiumComponent id={this.props.id} debug={true} style={{width:"100%", height:"100%"}}
                                 cities={this.props.cities}/>
                {/*<CesiumCityList cities={this.state.cities} onChange={this.handleCheckboxChange.bind(this)}/>*/}
                <div id="creditContainer" style={{display:"none"}}></div>
            </div>
        );
    }
}
