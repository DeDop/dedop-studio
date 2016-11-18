import * as React from "react";
import {Button, Collapse} from "@blueprintjs/core";

export interface ICollapseExampleState {
    isOpen?: boolean;
}

export class CollapseSample extends React.Component<{}, ICollapseExampleState> {
    public state = {
        isOpen: false,
    };

    public render() {
        return (
            <div>
                <Button onClick={this.handleClick}>
                    {this.state.isOpen ? "Hide" : "Show"} build logs
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                    <pre>
                        Dummy text.
                    </pre>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
}
