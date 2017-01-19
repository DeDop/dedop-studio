import * as React from 'react';
import {connect} from "react-redux";
import {State, GlobalMetadata} from "../../state";
import {Collapse} from "@blueprintjs/core";
import {GlobalMetadataTable} from "../GlobalMetadataTable";

interface IGlobalMetadataCollapseProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    globalMetadata: GlobalMetadata[];
    openCollapse: boolean;
}

function mapStateToProps(state: State): IGlobalMetadataCollapseProps {
    return {
        globalMetadata: state.control.selectedSourceFile ? state.data.sourceFiles[state.control.selectedSourceFile].globalMetadata : [],
        openCollapse: !!state.control.selectedSourceFile
    }
}

class GlobalMetadataCollapse extends React.Component<IGlobalMetadataCollapseProps,any> {
    render() {
        return (
            <div className="dedop-collapse">
                <div className="dedop-collapse-header">
                    <span className="dedop-collapse-header-icon pt-icon-standard pt-icon-th-list"/>
                    <span className="dedop-collapse-header-text">Global Metadata</span>
                </div>
                < Collapse isOpen={this.props.openCollapse} className="dedop-panel-content">
                    <GlobalMetadataTable globalMetadataArray={this.props.globalMetadata}/>
                </Collapse>
            </div>
        )
    }

}

export default connect(mapStateToProps)(GlobalMetadataCollapse);