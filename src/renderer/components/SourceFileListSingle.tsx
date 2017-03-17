import * as React from "react";
import {SourceFile, State} from "../state";
import {ContextMenuTarget, Menu, MenuItem, Tooltip, Position} from "@blueprintjs/core";
import {connect, Dispatch} from "react-redux";
import {selectSourceFile, addInputFiles, removeInputFiles, getGlobalAttributes} from "../actions";
import * as selector from "../selectors";
import * as path from "path";

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

@ContextMenuTarget
class SourceFileListSingle extends React.Component<ISourceFileListSingleProps,any> {
    isSourceFileAdded() {
        const index = this.props.addedSourceFiles.findIndex((x) => x.name === this.props.sourceFile.name);
        return index >= 0;
    }

    public renderContextMenu() {
        this.props.dispatch(selectSourceFile(this.props.sourceFile.name));
        this.props.dispatch(getGlobalAttributes(path.join(this.props.sourceFile.path)));
        const handleAdd = () => {
            this.props.dispatch(addInputFiles(this.props.currentWorkspace,
                [this.props.currentSourceFileDirectory.concat("/").concat(this.props.sourceFile.name)],
                [this.props.sourceFile]));
        };

        const handleRemove = () => {
            this.props.dispatch(removeInputFiles(this.props.currentWorkspace, [this.props.sourceFile.name]));
        };

        return (
            <Menu className="dedop-context-menu">
                {this.isSourceFileAdded() ?
                    <MenuItem onClick={handleRemove} text="Remove" iconName="pt-icon-add"/>
                    :
                    <MenuItem onClick={handleAdd} text="Add" iconName="pt-icon-add"/>}
            </Menu>
        );
    }

    render() {
        return (
            <div className="dedop-list-box-item">
                <span className="dedop-list-box-item-file-name">{this.props.sourceFile.name}</span>
                {this.isSourceFileAdded() ? <span
                        className="pt-tag pt-round dedop-list-box-item-file-size"
                        style={{paddingRight: '10px'}}>Added</span>
                    : null
                }
                <Tooltip content="file size" position={Position.LEFT}>
                        <span
                            className="pt-tag pt-intent-success dedop-list-box-item-file-size">{(this.props.sourceFile.size).toFixed(2)}
                            MB</span>
                </Tooltip>
                <Tooltip content="last modified date" position={Position.RIGHT}>
                        <span className="pt-tag pt-intent-primary dedop-list-box-item-last-updated">
                            {this.props.sourceFile.lastUpdated}
                            </span>
                </Tooltip>
            </div>
        )
    }
}

export default connect(mapStateToProps)(SourceFileListSingle);
