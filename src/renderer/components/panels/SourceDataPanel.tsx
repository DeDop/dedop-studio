import * as React from "react";
import {L1ADatasetsPanelHeader} from "./PanelHeader";
import {ListBox} from "../ListBox";

interface ISourceDataPanelProps {
    l1aInputFileNames: string[];
}

export class SourceDataPanel extends React.Component<ISourceDataPanelProps, any> {
    render() {
        const renderSingleItem = (itemIndex: number) => {
            const fileName = this.props.l1aInputFileNames[itemIndex];
            return (
                <div style={{display:'flex'}}>
                    <span>{fileName}</span>
                </div>
            );
        };

        return (
            <div className="dedop-collapse">
                <L1ADatasetsPanelHeader/>
                <div className="dedop-panel-content">
                    <label className="pt-file-upload pt-fill l1a-input-file-upload">
                        <input type="file"/>
                        <span className="pt-file-upload-input">Choose directory...</span>
                    </label>
                    <ListBox numItems={this.props.l1aInputFileNames.length} renderItem={renderSingleItem}/>
                </div>
            </div>
        )
    }
}
