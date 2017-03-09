import * as React from "react";
import {Cell, Column, Table} from "@blueprintjs/table";
import {GlobalAttribute} from "../../state";

interface IGlobalMetadataTableProps {
    globalMetadataArray: Array<GlobalAttribute>;
}

export class GlobalMetadataTable extends React.Component<IGlobalMetadataTableProps, null> {

    public render() {
        const renderNameCells = (rowIndex: number) => {
            return <Cell>{this.props.globalMetadataArray[rowIndex].name}</Cell>
        };
        const renderValueCells = (rowIndex: number) => {
            return <Cell>{this.props.globalMetadataArray[rowIndex].value}</Cell>
        };

        return (
            <Table numRows={this.props.globalMetadataArray.length} isRowHeaderShown={false}
                   columnWidths={[200, 450]} minRowHeight={100}>
                <Column name="Name" renderCell={renderNameCells}/>
                <Column name="Value" renderCell={renderValueCells}/>
            </Table>
        )
    }
}
