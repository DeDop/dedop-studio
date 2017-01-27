import {connect} from "react-redux";
import * as React from "react";
import {FootprintsPanel} from "./FootprintsPanel";
import {updatePanelTitle} from "../../actions";
import SourceDataPanel from "./SourceDataPanel";
import GlobalMetadataCollapse from "../collapse/GlobalMetadataCollapse";

interface IL1ADatasetsPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IL1ADatasetsPanelProps {
    return {};
}

class L1ADatasetsPanel extends React.Component<IL1ADatasetsPanelProps, any> {
    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Source Data"));
    }

    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item">
                    <SourceDataPanel/>
                    <GlobalMetadataCollapse/>
                </div>
                <div className="panel-flexbox-item">
                    <FootprintsPanel/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(L1ADatasetsPanel);
