import {connect} from "react-redux";
import * as React from "react";
import {FootprintsPanel} from "./FootprintsPanel";
import {updatePanelTitle} from '../../actions';
import SourceDataPanel from "./SourceDataPanel";
import GlobalMetadataCollapse from "../collapse/GlobalMetadataCollapse"
import {Intent, Button, Tooltip, Position} from "@blueprintjs/core";

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
                    <GlobalMetadataCollapse/>
                </div>
                <div className="panel-flexbox-item">
                    <FootprintsPanel/>
                    <Tooltip content="Configuration" className="dedop-nav-button-right" position={Position.LEFT}>
                        <Button intent={Intent.SUCCESS}
                                style={{marginLeft:'auto', width: '200px'}}
                                iconName="pt-icon-double-chevron-right"
                        >
                            Next
                        </Button>
                    </Tooltip>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(InputDatasetPanel);
