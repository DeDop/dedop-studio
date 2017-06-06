import * as React from "react";
import {connect} from "react-redux";
import {State, GlobalAttribute} from "../../state";
import {Collapse} from "@blueprintjs/core";
import {GlobalAttributesTable} from "../tables/GlobalAttributesTable";

interface IGlobalAttributesCollapseProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    globalAttributes?: GlobalAttribute[];
    openCollapse?: boolean;
}

function mapStateToProps(state: State): IGlobalAttributesCollapseProps {
    return {
        globalAttributes: state.control.globalAttributes,
        openCollapse: state.control.globalAttributes.length > 0
    }
}

class GlobalAttributesCollapse extends React.Component<IGlobalAttributesCollapseProps,any> {
    render() {
        return (
            <div className="dedop-collapse">
                <div className="dedop-collapse-header">
                    <span className="dedop-collapse-header-icon pt-icon-standard pt-icon-th-list"/>
                    <span className="dedop-collapse-header-text">Global Attributes</span>
                </div>
                < Collapse isOpen={this.props.openCollapse} className="dedop-panel-content">
                    <GlobalAttributesTable globalAttributes={this.props.globalAttributes}/>
                </Collapse>
            </div>
        )
    }

}

export default connect(mapStateToProps)(GlobalAttributesCollapse);
