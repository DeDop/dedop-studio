import * as React from "react";
import {Cell, Column, Table} from "@blueprintjs/table";
import {GlobalAttribute} from "../../state";

interface IGlobalAttributesTableProps {
    globalAttributes: GlobalAttribute[];
}

export class GlobalAttributesTable extends React.Component<IGlobalAttributesTableProps, null> {

    public render() {
        const renderNameCells = (rowIndex: number) => {
            return <Cell>{this.props.globalAttributes[rowIndex].name}</Cell>
        };
        const renderValueCells = (rowIndex: number) => {
            return <Cell>{this.props.globalAttributes[rowIndex].value}</Cell>
        };

        return (
            <Table numRows={this.props.globalAttributes.length} isRowHeaderShown={false}
                   columnWidths={[200, 450]} minRowHeight={100}>
                <Column name="Name" renderCell={renderNameCells}/>
                <Column name="Value" renderCell={renderValueCells}/>
            </Table>
        )
    }
}
