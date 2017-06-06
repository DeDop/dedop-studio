import * as React from "react";
import {State} from "../state";
import {connect} from "react-redux";
import {GeneralAlert} from "./Alerts";
import {Dispatch} from "redux";
import {updateWebapiDialog} from "../actions";

interface IBottomToolbarProps {
    webAPIStatus?: string;
    isWebapiDialogOpen?: boolean;
    dispatch?: Dispatch<State>;
}

function mapStateToProps(state: State): IBottomToolbarProps {
    return {
        webAPIStatus: state.communication.webAPIStatus,
        isWebapiDialogOpen: state.control.isWebapiDialogOpen
    };
}

class BottomToolbar extends React.Component<IBottomToolbarProps, any> {
    public render() {
        return (
            <div style={{margin: '0 0 0 10px'}}>
                <GeneralAlert isAlertOpen={this.props.isWebapiDialogOpen}
                              onConfirm={() => this.props.dispatch(updateWebapiDialog(false))}
                              message="cannot connect to dedop-webapi, please restart dedop-studio"
                              iconName="pt-icon-offline"
                />
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
