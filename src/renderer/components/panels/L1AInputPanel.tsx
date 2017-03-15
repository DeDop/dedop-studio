import * as React from "react";
import {Radio} from "@blueprintjs/core";
import {OrdinaryPanelHeader} from "./PanelHeader";
import {SourceFile, State} from "../../state";
import {connect, Dispatch} from "react-redux";
import * as selector from "../../selectors";
import {selectSourceFile} from "../../actions";

interface IL1AInputPanelProps {
    dispatch?: Dispatch<State>;
    sourceFiles: SourceFile[];
    currentSourceFile: string;
}

function mapStateToProps(state: State): IL1AInputPanelProps {
    return {
        sourceFiles: selector.getAddedSourceFiles(state),
        currentSourceFile: state.control.selectedSourceFile
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
        options.push(<option key="informationText" disabled>Select a single L1A file...</option>);
        for (let i of this.props.sourceFiles) {
            if (this.props.currentSourceFile == i.name) {
                options.push(<option selected key={i.name}>{i.name}</option>);
            } else {
                options.push(<option key={i.name}>{i.name}</option>);
            }
        }

        const handleOnChangeSourceFile = (event: React.FormEvent<HTMLSelectElement>) => {
            this.props.dispatch(selectSourceFile(event.currentTarget.value));
        };

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
                                    <select disabled={this.state.sourceType == "directory"}
                                            onChange={handleOnChangeSourceFile}>
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
