import * as React from "react";
import {GlobalMetadata} from "../state";
import {Cell, Column, Table, ColumnHeaderCell} from "@blueprintjs/table";

interface IGlobalMetadataTableProps {
    globalMetadataArray: Array<GlobalMetadata>;
}

export class GlobalMetadataTable extends React.Component<IGlobalMetadataTableProps, null> {

    public render() {
        const renderNameCells = (rowIndex: number) => {
            return <Cell>{this.props.globalMetadataArray[rowIndex].name}</Cell>
        };
        const renderTypeCells = (rowIndex: number) => {
            return <Cell>{this.props.globalMetadataArray[rowIndex].type}</Cell>
        };
        const renderValueCells = (rowIndex: number) => {
            return <Cell>{this.props.globalMetadataArray[rowIndex].value}</Cell>
        };

        return (
            <Table numRows={this.props.globalMetadataArray.length} isRowHeaderShown={false}
                   columnWidths={[200, 100, 350]} minRowHeight={100}>
                <Column name="Name" renderCell={renderNameCells}  />
                <Column name="Type" renderCell={renderTypeCells} />
                <Column name="Value" renderCell={renderValueCells} />
            </Table>
        )
    }
}
