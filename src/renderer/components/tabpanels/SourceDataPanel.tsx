import * as React from "react";
import {OrdinaryPanelHeader} from "../panels/PanelHeader";
import {ListBox} from "../ListBox";
import {State, SourceFile} from "../../state";
import {connect} from "react-redux";
import {selectSourceFile} from "../../actions";
import {Tooltip, Position} from "@blueprintjs/core";

interface ISourceDataPanelProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    l1aInputFileNames: SourceFile[];
    selectedSourceFile: string[];
}

function mapStateToProps(state: State): ISourceDataPanelProps {
    return {
        l1aInputFileNames: state.data.sourceFiles,
        selectedSourceFile: [state.control.selectedSourceFile]
    };
}

class SourceDataPanel extends React.Component<ISourceDataPanelProps, any> {
    render() {
        const renderFileList = (itemIndex: number) => {
            const sourceFile = this.props.l1aInputFileNames[itemIndex];
            return (
                <div className="dedop-list-box-item">
                    <span className="dedop-list-box-item-file-name">{sourceFile.name}</span>
                    <Tooltip content="file size" position={Position.LEFT}>
                        <span className="pt-tag pt-intent-success dedop-list-box-item-file-size">{sourceFile.size}
                            MB</span>
                    </Tooltip>
                    <Tooltip content="last modified date" position={Position.RIGHT}>
                        <span className="pt-tag pt-intent-primary dedop-list-box-item-last-updated">
                            {sourceFile.lastUpdated}
                            </span>
                    </Tooltip>
                </div>
            )
        };

        const handleSelectSourceFile = (oldSelection: Array<React.Key>, newSelection: Array<React.Key>) => {
            this.props.dispatch(selectSourceFile(newSelection.length > 0 ? newSelection[0] as string : null));
        };

        return (
            <div className="dedop-collapse">
                <OrdinaryPanelHeader title="L1A Datasets" icon="pt-icon-document"/>
                <div className="dedop-panel-content">
                    <label className="pt-file-upload pt-fill l1a-input-file-upload">
                        <input type="file"/>
                        <span className="pt-file-upload-input">Choose directory...</span>
                    </label>
                    <ListBox numItems={this.props.l1aInputFileNames.length}
                             renderItem={renderFileList}
                             onSelection={handleSelectSourceFile}
                             selection={this.props.selectedSourceFile ? this.props.selectedSourceFile : []}/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(SourceDataPanel);
