import * as React from "react";
import {Button, Collapse} from "@blueprintjs/core";

export interface ICollapseExampleState {
    isOpen?: boolean;
}

interface IPanelProps {
    panelTitle: string;
}

export class CollapseSample extends React.Component<IPanelProps, ICollapseExampleState> {
    public state = {
        isOpen: true,
    };

    public render() {
        return (
            <div>
                <div>
                    {this.props.panelTitle}
                    {this.state.isOpen ?
                        <span className="pt-icon-standard pt-icon-chevron-up" onClick={this.handleClick}
                              style={{textAlign: "right"}}/> :
                        <span className="pt-icon-standard pt-icon-chevron-down" onClick={this.handleClick}
                              style={{textAlign: "right"}}/>}
                </div>
                < Collapse isOpen={this.state.isOpen}>
                    <pre>
                        [11:53:30] Finished 'typescript-bundle-blueprint' after 769 ms<br/>
                        [11:53:30] Starting 'typescript-typings-blueprint'...<br/>
                        [11:53:30] Finished 'typescript-typings-blueprint' after 198 ms<br/>
                        [11:53:30] write ./blueprint.css<br/>
                        [11:53:30] Finished 'sass-compile-blueprint' after 2.84 s<br/>
                    </pre>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
}
