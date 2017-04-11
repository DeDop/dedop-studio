import * as React from "react";
import {ListBox, ListBoxSelectionMode} from "../ListBox";
import {Dispatch, connect} from "react-redux";
import {State} from "../../state";
import * as selector from "../../selectors";
import {updateSelectedOutputs} from "../../actions";

interface IOutputFilesPanel {
    dispatch?: Dispatch<State>;
    outputs: string[];
    selectedOutputFileNames: string[];
}

function mapStateToProps(state: State): IOutputFilesPanel {
    return {
        outputs: selector.getOutputNames(state),
        selectedOutputFileNames: state.control.selectedOutputFileNames
    }
}

class OutputFilesPanel extends React.Component<IOutputFilesPanel,any> {
    render() {
        const renderFileList = (itemIndex: number) => {
            return (
                <span>{this.props.outputs[itemIndex]}</span>
            )
        };

        const handleSelectOutputFile = (oldSelection: Array<React.Key>, newSelection: Array<React.Key>) => {
            this.props.dispatch(updateSelectedOutputs(newSelection.map(String)));
        };

        return (
            <ListBox numItems={this.props.outputs.length}
                     getItemKey={index => this.props.outputs[index]}
                     renderItem={renderFileList}
                     onSelection={handleSelectOutputFile}
                     selectionMode={ListBoxSelectionMode.MULTIPLE}
                     selection={this.props.selectedOutputFileNames ? this.props.selectedOutputFileNames : []}
            />
        )
    }
}

export default connect(mapStateToProps)(OutputFilesPanel);
