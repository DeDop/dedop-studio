import * as React from "react";
import {SourceFile, State} from "../state";
import {Tooltip, Position} from "@blueprintjs/core";
import {connect, Dispatch} from "react-redux";
import {removeInputFiles} from "../actions";
import * as selector from "../selectors";

interface ISourceFileListSingleProps {
    dispatch?: Dispatch<State>;
    addedSourceFiles: SourceFile[];
    sourceFile: SourceFile;
    currentWorkspace: string;
    currentSourceFileDirectory: string;
}

function mapStateToProps(state: State, ownProps: {sourceFile: SourceFile}): ISourceFileListSingleProps {
    return {
        addedSourceFiles: selector.getAddedSourceFiles(state),
        sourceFile: ownProps.sourceFile,
        currentWorkspace: state.control.currentWorkspaceName,
        currentSourceFileDirectory: state.control.currentSourceFileDirectory
    };
}

class SourceFileListSingle extends React.Component<ISourceFileListSingleProps,any> {
    private handleRemove = () => {
        this.props.dispatch(removeInputFiles(this.props.currentWorkspace, [this.props.sourceFile.name]));
    };

    render() {
        return (
            <div className="dedop-list-box-item">
                <span className="dedop-list-box-item-file-name">{this.props.sourceFile.name}</span>
                <Tooltip content="file size" position={Position.LEFT}>
                        <span
                            className="pt-tag pt-intent-success dedop-list-box-item-file-size">{(this.props.sourceFile.size).toFixed(2)}
                            MB</span>
                </Tooltip>
                <Tooltip content="last modified date" position={Position.BOTTOM}>
                        <span className="pt-tag dedop-list-box-item-last-updated">
                            {this.props.sourceFile.lastUpdated}
                            </span>
                </Tooltip>
                <Tooltip content="remove this file from workspace" position={Position.RIGHT}>
                    <span className="pt-icon-standard pt-icon-delete dedop-list-box-item-file-delete"
                          onClick={this.handleRemove}
                    />
                </Tooltip>
            </div>
        )
    }
}

export default connect(mapStateToProps)(SourceFileListSingle);
