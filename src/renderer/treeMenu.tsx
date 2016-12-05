import * as React from "react";

import {Classes, ITreeNode, Tooltip, Tree} from "@blueprintjs/core";
import {ConfigurationPanelHeader} from "./panelHeader";

export interface ITreeExampleState {
    nodes: ITreeNode[];
}

export default class TreeMenu extends React.Component<any,any> {
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
                    label: "Ocean",
                },
                {
                    iconName: "folder-close",
                    isExpanded: true,
                    label: <Tooltip content="Land">Land</Tooltip>,
                    childNodes: [
                        {
                            iconName: "document",
                            label: <Tooltip content="Alternate Delay-Doppler Processing">Alternate Delay-Doppler Processing</Tooltip>
                        },
                        {
                            iconName: "document",
                            label: <Tooltip content="Modified Surface Locations">Modified Surface Locations</Tooltip>
                        },
                    ],
                },
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Lakes",
                },
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Amazon Basin",
                },
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Icebergs",
                },
                {
                    hasCaret: true,
                    iconName: "folder-close",
                    isExpanded: false,
                    label: "Ice",
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
                <ConfigurationPanelHeader title="Configurations"/>
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
