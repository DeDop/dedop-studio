import * as React from "react";
import {SourceFile, State} from "../state";
import {ContextMenuTarget, Menu, MenuItem, Tooltip, Position} from "@blueprintjs/core";
import {connect} from "react-redux";
import {selectSourceFile} from "../actions";

interface ISourceFileListSingleProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    sourceFile: SourceFile;
    itemIndex: number;
}

function mapStateToProps(state: State, ownProps: {sourceFile: SourceFile, itemIndex: number}): ISourceFileListSingleProps {
    return {
        sourceFile: ownProps.sourceFile,
        itemIndex: ownProps.itemIndex
    };
}

@ContextMenuTarget
class SourceFileListSingle extends React.Component<ISourceFileListSingleProps,any> {
    public renderContextMenu() {
        this.props.dispatch(selectSourceFile(this.props.itemIndex));
        const handleSave = () => {
            // TODO(hans-permana, 20170206): to be hooked with add input action in the cli
            console.log("add input file", this.props.sourceFile.name);
        };

        return (
            <Menu className="dedop-context-menu">
                <MenuItem onClick={handleSave} text="Add" iconName="pt-icon-add"/>
            </Menu>
        );
    }

    render() {
        return (
            <div className="dedop-list-box-item">
                <span className="dedop-list-box-item-file-name">{this.props.sourceFile.name}</span>
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
