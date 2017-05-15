import * as React from "react";
import {State} from "../state";
import {connect} from "react-redux";

interface IBottomToolbarProps {
    webAPIStatus: string;
}

function mapStateToProps(state: State): IBottomToolbarProps {
    return {
        webAPIStatus: state.communication.webAPIStatus
    };
}

class BottomToolbar extends React.Component<IBottomToolbarProps, any> {
    public render() {
        return (
            <div style={{margin: '0 0 0 10px'}}>
                {this.props.webAPIStatus == 'open' ?
                    <span title="connected to dedop-webapi">
                        Ready.
                    </span>
                    :
                    <span style={{color: 'red'}}
                          title="connection to dedop-webapi has been lost, please restart dedop-studio">
                        Disconnected.
                    </span>}
            </div>
        )
    }
}

export default connect(mapStateToProps)(BottomToolbar);
