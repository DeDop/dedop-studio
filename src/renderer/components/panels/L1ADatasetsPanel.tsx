import {connect} from "react-redux";
import * as React from "react";
import {FootprintsPanel} from "./FootprintsPanel";
import SourceDataPanel from "../tabpanels/SourceDataPanel";
import GlobalMetadataCollapse from "../collapse/GlobalAttributesCollapse";

interface IL1ADatasetsPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IL1ADatasetsPanelProps {
    return {};
}

class L1ADatasetsPanel extends React.Component<IL1ADatasetsPanelProps, any> {
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
