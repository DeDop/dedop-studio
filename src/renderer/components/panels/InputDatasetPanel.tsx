import {connect} from "react-redux";
import * as React from "react";
import {DedopGlobalMetadataCollapse} from "../Collapse";
import {FootprintsPanel} from "./FootprintsPanel";
import {updatePanelTitle} from '../../actions';
import SourceDataPanel from "./SourceDataPanel";

interface IInputDatasetPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IInputDatasetPanelProps {
    return {};
}

class InputDatasetPanel extends React.Component<IInputDatasetPanelProps, any> {
    componentWillMount() {
        this.props.dispatch(updatePanelTitle("Source Data"));
    }

    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item">
                    <SourceDataPanel/>
                    <DedopGlobalMetadataCollapse panelTitle="Global Metadata" collapseIcon="pt-icon-th-list"/>
                </div>
                <div className="panel-flexbox-item">
                    <FootprintsPanel/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(InputDatasetPanel);
