import * as React from "react";

import { Classes, ITreeNode, Tooltip, Tree } from "@blueprintjs/core";

export interface ITreeExampleState {
    nodes: ITreeNode[];
}

export default class TreeMenu extends React.Component<any,any> {
    public constructor() {
        super();
        const tooltipLabel = <Tooltip content="An eye!"><span className="pt-icon-standard pt-icon-eye-open"/></Tooltip>;
        const longLabel = "Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.";
        /* tslint:disable:object-literal-sort-keys so childNodes can come last */
        this.state = {
            nodes: [
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: true,
                    label: "L1A_20161116",
                },
                {
                    iconName: "folder-close",
                    isExpanded: true,
                    label: <Tooltip content="L1A_20151116">L1A_20151116</Tooltip>,
                    childNodes: [
                        {iconName: "document", label: "dedop.config", secondaryLabel: tooltipLabel},
                        {iconName: "pt-icon-tag", label: longLabel},
                        {
                            hasCaret: true,
                            iconName: "pt-icon-folder-close",
                            label: <Tooltip content="foo">Output</Tooltip>,
                            childNodes: [
                                {label: "No-Icon Item"},
                                {iconName: "pt-icon-tag", label: "Item 1"},
                                {
                                    hasCaret: true, iconName: "pt-icon-folder-close", label: "Folder 3",
                                    childNodes: [
                                        {iconName: "document", label: "Item 0"},
                                        {iconName: "pt-icon-tag", label: "Item 1"},
                                    ],
                                },
                            ],
                        },
                    ],
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
            <Tree
                contents={this.state.nodes}
                onNodeClick={this.handleNodeClick}
                onNodeCollapse={this.handleNodeCollapse}
                onNodeExpand={this.handleNodeExpand}
                className={Classes.ELEVATION_0}
            />
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
