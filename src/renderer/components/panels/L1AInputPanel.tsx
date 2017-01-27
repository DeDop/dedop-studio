import * as React from "react";
import {Radio} from "@blueprintjs/core";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {SourceFile} from "../../state";
import {dummyInputL1aFiles} from "../../initialStates";
import {connect} from "react-redux";

interface IL1AInputPanelProps {
    sourceFiles: SourceFile[];
}

function mapStateToProps(): IL1AInputPanelProps {
    return {
        sourceFiles: dummyInputL1aFiles
    }
}

class L1AInputPanel extends React.Component<IL1AInputPanelProps,any> {
    public state = {
        sourceType: "single"
    };

    render() {
        const handleChange = () => {
            this.setState({
                sourceType: this.state.sourceType === "single" ? "directory" : "single"
            })
        };

        let options = [];
        options.push(<option key="informationText" selected disabled>Select a single L1A file...</option>);
        for (let i in this.props.sourceFiles) {
            options.push(<option key={i}>{this.props.sourceFiles[i].name}</option>);
        }

        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="L1A Input" icon="pt-icon-database"/>
                <div className="dedop-panel-content l1a-input-radio-group">
                    <table width='100%'>
                        <tbody>
                        <tr>
                            <td width='20%'>
                                <Radio label="Single file" value="single" checked={this.state.sourceType == "single"}
                                       onChange={handleChange}/>
                            </td>
                            <td width='80%'>
                                <div className="pt-select pt-fill">
                                    <select disabled={this.state.sourceType == "directory"}>
                                        {options}
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Radio label="Directory" value="directory"
                                       checked={this.state.sourceType == "directory"}
                                       onChange={handleChange}/>
                            </td>
                            <td>
                                <label className="pt-file-upload pt-fill l1a-input-file-upload">
                                    <input type="file" disabled={this.state.sourceType == "single"}/>
                                    <span
                                        className="pt-file-upload-input">Choose directory...</span>
                                </label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(L1AInputPanel);
