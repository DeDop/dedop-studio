import * as React from "react";

import {Classes, ITreeNode, Tree} from "@blueprintjs/core";
import {Configuration, State} from "../state";
import {connect} from "react-redux";
import * as selector from "../selectors";
import {Dispatch} from "redux";
import {updateConfigSelection} from "../actions";

export interface IOutputFilesTreeMenuProps {
    dispatch?: Dispatch<State>;
    configurations: Configuration[];
    selectedConfigurationName: string;
}

function mapStateToProps(state: State): IOutputFilesTreeMenuProps {
    return {
        configurations: selector.getAllConfigurations(state),
        selectedConfigurationName: state.control.selectedConfigurationName
    }
}

class OutputFilesTreeMenu extends React.Component<IOutputFilesTreeMenuProps, any> {
    private handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], event: React.MouseEvent<HTMLElement>) => {
        this.props.dispatch(updateConfigSelection('' + nodeData.id));
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

    public render() {
        let nodes: ITreeNode[] = [];
        for (let config of this.props.configurations) {
            const outputFilesNode: ITreeNode[] = [];
            for (let outputFileName of config.outputs) {
                outputFilesNode.push({
                    id: outputFileName,
                    label: outputFileName,
                    iconName: 'pt-icon-document'
                });
            }
            const configNode: ITreeNode = {
                id: config.name,
                label: config.name,
                hasCaret: true,
                isExpanded: config.name == this.props.selectedConfigurationName,
                isSelected: config.name == this.props.selectedConfigurationName,
                childNodes: outputFilesNode
            };
            nodes.push(configNode)
        }

        return (
            <div>
                <Tree
                    contents={nodes}
                    onNodeClick={this.handleNodeClick}
                    onNodeCollapse={this.handleNodeCollapse}
                    onNodeExpand={this.handleNodeExpand}
                    className={Classes.ELEVATION_0}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(OutputFilesTreeMenu);
