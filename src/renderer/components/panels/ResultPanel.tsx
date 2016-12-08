import * as React from 'react';
import {connect} from "react-redux";
import {updatePanelTitle} from "../../actions";

interface IResultPanelProps {
    dispatch?: (action: {type: string, payload: string}) => void;
}

function mapStateToProps(): IResultPanelProps {
    return {};
}

export class ResultPanel extends React.Component<IResultPanelProps, any> {
    componentWillMount(){
        this.props.dispatch(updatePanelTitle("Results & Analysis"));
    }

    public render() {
        return (
            <div>
                ResultPanel
            </div>
        )
    }
}

export default connect(mapStateToProps)(ResultPanel);
