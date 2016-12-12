import * as React from "react";

import {Classes, ITreeNode, Tooltip, Tree} from "@blueprintjs/core";

export interface ITreeExampleState {
    nodes: ITreeNode[];
}

export class OutputFilesTreeMenu extends React.Component<any,any> {
    public constructor() {
        super();
        const tooltipLabel = <Tooltip content="An eye!"><span className="pt-icon-standard pt-icon-eye-open"/></Tooltip>;
        /* tslint:disable:object-literal-sort-keys so childNodes can come last */
        this.state = {
            nodes: [
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Alternate Delay-Doppler Processing",
                },
                {
                    iconName: "folder-close",
                    isExpanded: true,
                    label: "Modified Surface Locations",
                    childNodes: [
                        {
                            iconName: "document",
                            label: "L1B_Output1"
                        },
                        {
                            iconName: "document",
                            label: "L1B_Output2"
                        },
                    ],
                },
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Config1",
                },
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Config2",
                },
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Config3",
                },
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Config4",
                },
            ],
        } as any as ITreeExampleState;
        /* tslint:enable:object-literal-sort-keys */
        let i = 0;
        this.forEachNode(this.state.nodes, (n) => n.id = i++);
    }

    // override @PureRender because nodes are not a primitive type and therefore aren't included in
    // shallow prop comparison
    public shouldComponentUpdate() {
        return true;
    }

    public render() {
        return (
            <div>
                <Tree
                    contents={this.state.nodes}
                    onNodeClick={this.handleNodeClick}
                    onNodeCollapse={this.handleNodeCollapse}
                    onNodeExpand={this.handleNodeExpand}
                    className={Classes.ELEVATION_0}
                />
            </div>
        );
    }

    private handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, (n) => n.isSelected = false);
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state);
    };

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

    private forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            this.forEachNode(node.childNodes, callback);
        }
    }
}
