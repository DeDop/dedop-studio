import {connect} from "react-redux";
import * as React from "react";
import FootprintsPanel from "../panels/FootprintsPanel";
import L1aDatasetsPanel from "../panels/L1aDatasetsPanel";
import GlobalMetadataCollapse from "../collapse/GlobalAttributesCollapse";

interface ISourceDataPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): ISourceDataPanelProps {
    return {};
}

class SourceDataPanel extends React.Component<ISourceDataPanelProps, any> {
    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item">
                    <L1aDatasetsPanel/>
                    <GlobalMetadataCollapse/>
                </div>
                <div className="panel-flexbox-item">
                    <FootprintsPanel/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(SourceDataPanel);
