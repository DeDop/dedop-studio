import * as React from "react";
import {ProcessingItem, State, TaskState} from "../../state";
import {Cell, Column, IRegion, Table} from "@blueprintjs/table";
import {connect} from "react-redux";
import {updateMainTab, updateSelectedProcesses} from "../../actions";
import {JobStatusEnum} from "../../webapi/Job";
import * as selector from "../../selectors";

interface IProcessingTableProps {
    dispatch?: (action: { type: string, payload: any }) => void;
    tasks?: { [jobId: number]: TaskState; };
    processes?: ProcessingItem[];
    selectedProcesses?: number[];
}

function mapStateToProps(state: State): IProcessingTableProps {
    return {
        tasks: state.communication.tasks,
        processes: selector.getCurrentWorkspaceProcesses(state),
        selectedProcesses: state.control.selectedProcesses
    }
}

class ProcessingTable extends React.Component<IProcessingTableProps, null> {

    public render() {
        const compareIdReverse = (a: ProcessingItem, b: ProcessingItem) => {
            return b.id - a.id;
        };

        const processesReverse = this.props.processes.slice().sort(compareIdReverse);

        const runCell = (rowIndex: number) => {
            return <Cell>{processesReverse[rowIndex].name}</Cell>
        };
        const workspaceCell = (rowIndex: number) => {
            return <Cell>{processesReverse[rowIndex].workspace}</Cell>
        };
        const configCell = (rowIndex: number) => {
            return <Cell>{processesReverse[rowIndex].configuration}</Cell>
        };
        const startedCell = (rowIndex: number) => {
            return <Cell>{processesReverse[rowIndex].startedTime}</Cell>
        };
        const statusCell = (rowIndex: number) => {
            const taskId = processesReverse[rowIndex].taskId;
            if (processesReverse[rowIndex].status == JobStatusEnum.DONE
                || processesReverse[rowIndex].status == JobStatusEnum.FAILED) {
                return <Cell>{processesReverse[rowIndex].status}</Cell>
            } else {
                if (this.props.tasks[taskId].status == JobStatusEnum.IN_PROGRESS) {
                    const percentage = ((this.props.tasks[taskId].progress.worked / this.props.tasks[taskId].progress.total) * 100).toFixed(2).toString();
                    return (
                        <Cell tooltip={percentage.concat("%")}>
                            <div className="pt-progress-bar" style={{marginTop: "5px"}}>
                                <div className="pt-progress-meter" style={{width: percentage.concat("%")}}/>
                            </div>
                        </Cell>)
                } else {
                    return <Cell>{this.props.tasks[taskId].status.toString()}</Cell>
                }
            }
        };
        const processingTimeCell = (rowIndex: number) => {
            const taskId = processesReverse[rowIndex].taskId;
            if (processesReverse[rowIndex].status == JobStatusEnum.DONE
                || processesReverse[rowIndex].status == JobStatusEnum.FAILED) {
                return <Cell>{processesReverse[rowIndex].processingDuration}</Cell>
            } else {
                return (
                    <Cell>{this.props.tasks[taskId].status === "IN_PROGRESS" ? "-" : processesReverse[rowIndex].processingDuration}</Cell>
                )
            }
        };
        const handleOpenResult = () => {
            this.props.dispatch(updateMainTab(3));
        };
        const actionCell = (rowIndex: number) => {
            switch (processesReverse[rowIndex].status) {
                case "DONE":
                    return (
                        <Cell style={{textAlign: "center"}} tooltip="go to Result & Analysis">
                            <span className="pt-icon-standard pt-icon-timeline-bar-chart" onClick={handleOpenResult}/>
                        </Cell>);
                case "FAILED":
                    return (
                        <Cell style={{textAlign: "center"}}
                              tooltip={"Error: ".concat(processesReverse[rowIndex].message)}>
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

        const onSelectedRegionTransform = (region: IRegion): IRegion => {
            if (region.rows) {
                return {
                    rows: region.rows
                }
            } else {
                return region;
            }
        };

        const handleOnSelection = (selectedRegions: IRegion[]) => {
            let selectedProcesses: number[] = [];
            if (selectedRegions.length > 0 && selectedRegions[0].rows) {
                const selectedRange = selectedRegions[0].rows;
                for (let i = selectedRange[0]; i <= selectedRange[1]; i++) {
                    selectedProcesses.push(processesReverse[i].id);
                }
            }
            this.props.dispatch(updateSelectedProcesses(selectedProcesses));
        };

        let selectedRegions: IRegion[] = [];
        let rowNumber: number[] = [];
        if (this.props.selectedProcesses) {
            for (let i of this.props.selectedProcesses) {
                for (let j in processesReverse) {
                    if (i == processesReverse[j].id) {
                        rowNumber.push(parseInt(j));
                    }
                }
            }
            if (rowNumber.length == 1) {
                selectedRegions.push({rows: [rowNumber[0], rowNumber[0]]})
            } else if (rowNumber.length > 1) {
                let rowStart: number = rowNumber[0];
                let rowEnd: number = rowStart;
                for (let i = 1; i < rowNumber.length; i++) {
                    if (rowNumber[i] == rowEnd + 1 && (i + 1 < rowNumber.length)) {
                        rowEnd++;
                    } else if (i + 1 < rowNumber.length) {
                        selectedRegions.push({rows: [rowStart, rowEnd]});
                        rowStart = rowNumber[i];
                        rowEnd = rowNumber[i] + 1;
                    } else {
                        rowEnd++;
                        selectedRegions.push({rows: [rowStart, rowEnd]});
                    }
                }
            }
        }

        return (
            <Table numRows={this.props.processes.length}
                   isRowHeaderShown={false}
                   maxRowHeight={30}
                   defaultColumnWidth={110}
                   onSelection={handleOnSelection}
                   selectedRegionTransform={onSelectedRegionTransform}
                   selectedRegions={selectedRegions}
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
