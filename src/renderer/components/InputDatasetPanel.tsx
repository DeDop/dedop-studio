import {connect} from "react-redux";
import * as React from "react";
import {DedopL1aInputListCollapse, DedopCollapse} from "./Collapse";
import {dummyInputL1aFiles} from "../initialStates";
import {FootprintsPanel} from "./FootprintsPanel";
import {State} from "../state";
import {updatePanelTitle} from '../actions';

interface IInputDatasetPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
    title: string;
}

function mapStateToProps(state: State): IInputDatasetPanelProps {
    return {
        title: state.control.mainPanelTitle,
    };
}

class InputDatasetPanel extends React.Component<IInputDatasetPanelProps, any> {
    public render() {
        this.props.dispatch(updatePanelTitle("Source Data"));

        return (
            <div className="panel-flexbox">
                <div className="panel-flexbox-item">
                    <DedopL1aInputListCollapse panelTitle="L1A Datasets" collapseIcon="pt-icon-document"
                                               l1aInputFileNames={dummyInputL1aFiles}/>
                    <DedopCollapse panelTitle="Global Metadata" collapseIcon="pt-icon-properties"/>
                </div>
                <div className="panel-flexbox-item">
                    <FootprintsPanel/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(InputDatasetPanel);
