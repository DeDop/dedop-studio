import * as React from "react";
import {ProcessingItem, State, TaskState} from "../../state";
import {Cell, Column, Table} from "@blueprintjs/table";
import {connect} from "react-redux";
import {updateMainTab} from "../../actions";
import {JobStatusEnum} from "../../webapi/Job";

interface IProcessingTableProps {
    dispatch?: (action: {type: string, payload: any}) => void;
    tasks: {[jobId: number]: TaskState;};
    processes: ProcessingItem[];
}

function mapStateToProps(state: State): IProcessingTableProps {
    return {
        tasks: state.communication.tasks,
        processes: state.data.processes
    }
}

class ProcessingTable extends React.Component<IProcessingTableProps, null> {

    public render() {
        const runCell = (rowIndex: number) => {
            return <Cell>{this.props.processes[rowIndex].name}</Cell>
        };
        const workspaceCell = (rowIndex: number) => {
            return <Cell>{this.props.processes[rowIndex].workspace}</Cell>
        };
        const configCell = (rowIndex: number) => {
            return <Cell>{this.props.processes[rowIndex].configuration}</Cell>
        };
        const startedCell = (rowIndex: number) => {
            return <Cell>{this.props.processes[rowIndex].startedTime}</Cell>
        };
        const statusCell = (rowIndex: number) => {
            const jobId = this.props.processes[rowIndex].id;
            if (this.props.processes[rowIndex].status == JobStatusEnum.DONE || this.props.processes[rowIndex].status == JobStatusEnum.FAILED) {
                return <Cell>{this.props.processes[rowIndex].status}</Cell>
            } else {
                if (this.props.tasks[jobId].status == JobStatusEnum.IN_PROGRESS) {
                    const percentage = ((this.props.tasks[jobId].progress.worked / this.props.tasks[jobId].progress.total) * 100).toFixed(2).toString();
                    return (
                        <Cell tooltip={percentage.concat("%")}>
                            <div className="pt-progress-bar" style={{marginTop: "5px"}}>
                                <div className="pt-progress-meter" style={{width: percentage.concat("%")}}></div>
                            </div>
                        </Cell>)
                } else {
                    return <Cell>{this.props.tasks[jobId].status.toString()}</Cell>
                }
            }
        };
        const processingTimeCell = (rowIndex: number) => {
            const jobId = this.props.processes[rowIndex].id;
            if (this.props.processes[rowIndex].status == JobStatusEnum.DONE || this.props.processes[rowIndex].status == JobStatusEnum.FAILED) {
                return <Cell>{this.props.processes[rowIndex].processingDuration}</Cell>
            } else {
                return (
                    <Cell>{this.props.tasks[jobId].status === "IN_PROGRESS" ? "-" : this.props.processes[rowIndex].processingDuration}</Cell>
                )
            }
        };
        const handleOpenResult = () => {
            console.log("clicked");
            this.props.dispatch(updateMainTab(3));
        };
        const actionCell = (rowIndex: number) => {
            switch (this.props.processes[rowIndex].status) {
                case "DONE":
                    return (
                        <Cell style={{textAlign: "center"}}>
                            <span className="pt-icon-standard pt-icon-folder-open" onClick={handleOpenResult}/>
                        </Cell>);
                case "FAILED":
                    return (
                        <Cell style={{textAlign: "center"}}
                              tooltip={"Error: ".concat(this.props.processes[rowIndex].message)}>
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
            <Table numRows={this.props.processes.length}
                   isRowHeaderShown={false}
                   maxRowHeight={30}
            >
                <Column name="Process Name" renderCell={runCell}/>
                <Column name="Workspace" renderCell={workspaceCell}/>
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
