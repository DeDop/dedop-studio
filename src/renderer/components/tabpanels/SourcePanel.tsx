import {connect} from "react-redux";
import * as React from "react";
import FootprintsPanel from "../panels/FootprintsPanel";
import L1aDatasetsPanel from "../panels/L1aDatasetPanel";
import GlobalMetadataCollapse from "../collapse/GlobalAttributesCollapse";

interface ISourcePanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): ISourcePanelProps {
    return {};
}

class SourcePanel extends React.Component<ISourcePanelProps, any> {
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

export default connect(mapStateToProps)(SourcePanel);
