import {connect} from "react-redux";
import * as React from "react";
import {DedopL1aInputListCollapse, DedopGlobalMetadataCollapse} from "../Collapse";
import {dummyInputL1aFiles} from "../../initialStates";
import {FootprintsPanel} from "../FootprintsPanel";
import {updatePanelTitle} from '../../actions';

interface IInputDatasetPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IInputDatasetPanelProps {
    return {};
}

class InputDatasetPanel extends React.Component<IInputDatasetPanelProps, any> {
    componentWillMount(){
        this.props.dispatch(updatePanelTitle("Source Data"));
    }

    public render() {
        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item">
                    <DedopL1aInputListCollapse panelTitle="L1A Datasets" collapseIcon="pt-icon-document"
                                               l1aInputFileNames={dummyInputL1aFiles}/>
                    <DedopGlobalMetadataCollapse panelTitle="Global Metadata" collapseIcon="pt-icon-properties"/>
                </div>
                <div className="panel-flexbox-item">
                    <FootprintsPanel/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(InputDatasetPanel);
