import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {remote} from "electron";
import {Dispatch, connect} from "react-redux";
import {State} from "../../state";
import {updateCurrentOutputDirectory} from "../../actions";

interface IL1BL1BSOutputPanelProps {
    dispatch?: Dispatch<State>;
    currentOutputDirectory: string;
}

function mapStateToProps(state: State): IL1BL1BSOutputPanelProps {
    return {
        currentOutputDirectory: state.control.currentOutputDirectory
    }
}

class L1BL1BSOutputPanel extends React.Component<IL1BL1BSOutputPanelProps,any> {
    render() {
        const handleSelectDirectory = () => {
            const outputFileDirectory = remote.dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    defaultPath: this.props.currentOutputDirectory
                }
            );
            this.props.dispatch(updateCurrentOutputDirectory(outputFileDirectory[0]))
        };

        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="L1B & L1BS Output" icon="pt-icon-document"/>
                <div className="dedop-panel-content">
                    <table width='100%'>
                        <tbody>
                        <tr>
                            <td width='20%'>
                                Output directory
                            </td>
                            <td width='80%'>
                                <div className="pt-input-group">
                                    <input type="text"
                                           title={this.props.currentOutputDirectory}
                                           className="pt-input"
                                           style={{textAlign: 'left'}}
                                           readOnly={true}
                                           value={this.props.currentOutputDirectory}
                                           onClick={handleSelectDirectory}
                                    />
                                    <button className="pt-button pt-minimal pt-icon-folder-open pt-intent-primary"
                                            onClick={handleSelectDirectory}
                                    />
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(L1BL1BSOutputPanel)
