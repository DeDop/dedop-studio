import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {remote} from "electron";
import {connect, Dispatch} from "react-redux";
import {State} from "../../state";
import {updateCurrentOutputDirectory, updateSelectedOutputDirectoryType} from "../../actions";
import {Radio} from "@blueprintjs/core";

interface IL1BL1BSOutputPanelProps {
    dispatch?: Dispatch<State>;
    currentOutputDirectory?: string;
    selectedOutputDirectoryType?: string;
}

function mapStateToProps(state: State): IL1BL1BSOutputPanelProps {
    return {
        currentOutputDirectory: state.control.currentOutputDirectory,
        selectedOutputDirectoryType: state.control.selectedOutputDirectoryType
    }
}

class L1BL1BSOutputPanel extends React.Component<IL1BL1BSOutputPanelProps, any> {
    constructor() {
        super();
        this.handleSelectDefaultOutputDirectoryType = this.handleSelectDefaultOutputDirectoryType.bind(this);
        this.handleSelectOtherOutputDirectoryType = this.handleSelectOtherOutputDirectoryType.bind(this);
    }

    private handleSelectDefaultOutputDirectoryType() {
        if (this.props.selectedOutputDirectoryType != "default") {
            this.props.dispatch(updateSelectedOutputDirectoryType("default"));
        }
    }

    private handleSelectOtherOutputDirectoryType() {
        if (this.props.selectedOutputDirectoryType != "other") {
            this.props.dispatch(updateSelectedOutputDirectoryType("other"));
        }
    }

    render() {
        const handleSelectDirectory = () => {
            const outputFileDirectory = remote.dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    defaultPath: this.props.currentOutputDirectory
                }
            );
            if (outputFileDirectory && outputFileDirectory.length) {
                this.props.dispatch(updateCurrentOutputDirectory(outputFileDirectory[0]))
            }
        };

        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="L1B & L1BS Output Directory" icon="pt-icon-document"/>
                <div className="dedop-panel-content l1a-input-radio-group">
                    <Radio label="Default" value="default"
                           checked={this.props.selectedOutputDirectoryType == "default"}
                           onChange={this.handleSelectDefaultOutputDirectoryType}
                           style={{marginRight: '15px'}}
                    />
                    <Radio label="Other" value="other"
                           checked={this.props.selectedOutputDirectoryType == "other"}
                           onChange={this.handleSelectOtherOutputDirectoryType}/>
                </div>
                <div className="pt-input-group">
                    <input type="text"
                           title={this.props.currentOutputDirectory}
                           className="pt-input"
                           style={{textAlign: 'left'}}
                           readOnly={true}
                           value={this.props.currentOutputDirectory}
                           onClick={handleSelectDirectory}
                           disabled={this.props.selectedOutputDirectoryType == "default"}
                    />
                    <button className="pt-button pt-minimal pt-icon-folder-open pt-intent-primary"
                            onClick={handleSelectDirectory}
                    />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(L1BL1BSOutputPanel)
