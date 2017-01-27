import * as React from "react";

export class WorkflowBreadcrumb extends React.Component<any,any> {
    public render() {
        return (
            <div className="dedop-breadcrumb">
                <ul className="pt-breadcrumbs">
                    <li><a className="pt-breadcrumb">Source Data</a></li>
                    <li><a className="pt-breadcrumb" href="#">Configuration</a></li>
                    <li><a className="pt-breadcrumb" href="#">Processing</a></li>
                    <li><span className="pt-breadcrumb pt-breadcrumb-current">Result & Analysis</span></li>
                </ul>
            </div>
        )
    }
}
