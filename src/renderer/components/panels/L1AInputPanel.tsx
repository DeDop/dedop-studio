import * as React from "react";
import {Radio} from "@blueprintjs/core";
import {OrdinaryPanelHeader} from "./PanelHeader";

export class L1AInputPanel extends React.Component<any,any> {
    public state = {
        isOpen: true,
        sourceType: "single"
    };

    render() {
        const handleChange = () => {
            this.setState({
                isOpen: this.state.isOpen,
                sourceType: this.state.sourceType === "single" ? "directory" : "single"
            })
        };

        const handleClick = () => {
            this.setState({
                isOpen: !this.state.isOpen,
                sourceType: this.state.sourceType
            });
        };

        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="L1A Input" icon="pt-icon-database"/>
                <div className="dedop-panel-content l1a-input-radio-group">
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <Radio label="Single file" value="single" checked={this.state.sourceType == "single"}
                                       onChange={handleChange}/>
                            </td>
                            <td style={{width: '100%'}}>
                                <div className="pt-select pt-fill">
                                    <select disabled={this.state.sourceType == "directory"}>
                                        <option selected>Select a configuration...</option>
                                        <option value="1">Alternate Delay-Doppler Processing</option>
                                        <option value="2">Modified Surface Locations</option>
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
                            <td style={{width: '100%'}}>
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
