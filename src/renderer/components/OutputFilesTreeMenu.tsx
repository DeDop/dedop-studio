import * as React from "react";

import {Classes, ITreeNode, Tree} from "@blueprintjs/core";
import {Configuration, State} from "../state";
import {connect} from "react-redux";
import * as selector from "../selectors";
import {Dispatch} from "redux";
import {updateConfigSelection, updateSelectedOutputs} from "../actions";

export interface IOutputFilesTreeMenuProps {
    dispatch?: Dispatch<State>;
    configurations: Configuration[];
    selectedConfigurationName: string;
    selectedOutputFileNames: string[];
}

function mapStateToProps(state: State): IOutputFilesTreeMenuProps {
    return {
        configurations: selector.getAllConfigurations(state),
        selectedConfigurationName: state.control.selectedConfigurationName,
        selectedOutputFileNames: state.control.selectedOutputFileNames
    }
}

class OutputFilesTreeMenu extends React.Component<IOutputFilesTreeMenuProps, any> {
    public constructor(props) {
        super(props);
        let nodes: ITreeNode[] = [];
        for (let config of props.configurations) {
            const outputFilesNode: ITreeNode[] = [];
            for (let outputFileName of config.outputs) {
                outputFilesNode.push({
                    id: outputFileName,
                    label: outputFileName,
                    iconName: 'pt-icon-document',
                    isSelected: !!this.props.selectedOutputFileNames && this.props.selectedOutputFileNames.indexOf(outputFileName) > -1
                });
            }
            const style = config.name == props.selectedConfigurationName ? 'dedop-output-files-bold' : '';
            const configNode: ITreeNode = {
                id: config.name,
                label: config.name,
                hasCaret: true,
                isExpanded: config.name == props.selectedConfigurationName,
                childNodes: outputFilesNode,
                className: style
            };
            nodes.push(configNode)
        }
        this.state = {
            nodes: nodes
        }
    }

    componentWillReceiveProps(nextProps) {
        let nodes: ITreeNode[] = [];
        for (let config of nextProps.configurations) {
            const nodeIndex = this.state.nodes.findIndex((x) => x.id == config.name);
            const outputFilesNode: ITreeNode[] = [];
            for (let outputFileName of config.outputs) {
                outputFilesNode.push({
                    id: outputFileName,
                    label: outputFileName,
                    iconName: 'pt-icon-document',
                    isSelected: !!this.props.selectedOutputFileNames && this.props.selectedOutputFileNames.indexOf(outputFileName) > -1
                });
            }
            const style = config.name == nextProps.selectedConfigurationName ? 'dedop-output-files-bold' : '';
            const configNode: ITreeNode = {
                id: config.name,
                label: config.name,
                hasCaret: true,
                isExpanded: this.state.nodes[nodeIndex].isExpanded || config.name == nextProps.selectedConfigurationName,
                childNodes: outputFilesNode,
                className: style
            };
            nodes.push(configNode)
        }
        this.state = {
            nodes: nodes
        }
    }

    private handleNodeClick = (nodeData: ITreeNode) => {
        let isConfigName = false;
        for (let config of this.props.configurations) {
            if (config.name == nodeData.id) {
                isConfigName = true;
                break
            }
        }

        if (isConfigName) {
            this.props.dispatch(updateConfigSelection('' + nodeData.id));
        } else {
            nodeData.isSelected = !nodeData.isSelected;
            this.setState(this.state);
            let selectedOutputFiles = this.getSelectedOutputFiles();
            this.props.dispatch(updateSelectedOutputs(Array.from(selectedOutputFiles)));
        }
    };

    private getSelectedOutputFiles(): Set<string> {
        let selectedOutputFiles: Set<string> = new Set();
        for (let configNode of this.state.nodes) {
            for (let outputFileNameNode of configNode.childNodes) {
                if (outputFileNameNode.isSelected) {
                    selectedOutputFiles.add(outputFileNameNode.id);
                }
            }
        }
        return selectedOutputFiles;
    }

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

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
}

export default connect(mapStateToProps)(OutputFilesTreeMenu);
