import * as React from "react";
import {ProcessingItem, State} from "../../state";
import {Cell, Column, Table} from "@blueprintjs/table";
import {connect} from "react-redux";
import {updateMainTab} from "../../actions";

interface IProcessingTableProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    processingItems: Array<ProcessingItem>;
}

function mapStateToProps(state: State): IProcessingTableProps {
    return {
        processingItems: state.data.processes
    }
}

class ProcessingTable extends React.Component<IProcessingTableProps, null> {

    public render() {
        const runCell = (rowIndex: number) => {
            return <Cell>{this.props.processingItems[rowIndex].name}</Cell>
        };
        const configCell = (rowIndex: number) => {
            return <Cell>{this.props.processingItems[rowIndex].configuration}</Cell>
        };
        const startedCell = (rowIndex: number) => {
            return <Cell>{this.props.processingItems[rowIndex].startedTime}</Cell>
        };
        const statusCell = (rowIndex: number) => {
            return <Cell>{this.props.processingItems[rowIndex].status.toString()}</Cell>
        };
        const processingTimeCell = (rowIndex: number) => {
            return (
                <Cell>{this.props.processingItems[rowIndex].status === "IN_PROGRESS" ? "-" : this.props.processingItems[rowIndex].processingDuration}</Cell>
            )
        };
        const handleOpenResult = () => {
            console.log("clicked");
            this.props.dispatch(updateMainTab(3));
        };
        const actionCell = (rowIndex: number) => {
            switch (this.props.processingItems[rowIndex].status) {
                case "DONE":
                    return (
                        <Cell style={{textAlign: "center"}}>
                            <span className="pt-icon-standard pt-icon-folder-open" onClick={handleOpenResult}/>
                        </Cell>);
                case "FAILED":
                    return (
                        <Cell style={{textAlign: "center"}}>
                            <span className="pt-icon-standard pt-icon-warning-sign"/>
                        </Cell>);
                case "IN_PROGRESS":
                    return (
                        <Cell style={{textAlign: "center"}}>
                            <span className="pt-icon-standard pt-icon-play"/>
                        </Cell>);
                case "CANCELLED":
                    return (
                        <Cell style={{textAlign: "center"}}>
                            <span className="pt-icon-standard pt-icon-disable"/>
                        </Cell>);
                default:
                    return (
                        <Cell style={{alignText: "center"}}>
                            <span>-</span>
                        </Cell>)
            }
        };

        const renderActionHeaderName = () => {
            return (<div style={{textAlign: "center"}}>Action</div>)
        };

        return (
            <Table numRows={this.props.processingItems.length} isRowHeaderShown={false}
                   columnWidths={[75, 150, 120, 100, 100, 100]}>
                <Column name="Run" renderCell={runCell}/>
                <Column name="Configuration" renderCell={configCell}/>
                <Column name="Started" renderCell={startedCell}/>
                <Column name="Status" renderCell={statusCell}/>
                <Column name="Processing Time" renderCell={processingTimeCell}/>
                <Column name="Action" renderCell={actionCell} renderName={renderActionHeaderName}/>
            </Table>
        )
    }
}

export default connect(mapStateToProps)(ProcessingTable);