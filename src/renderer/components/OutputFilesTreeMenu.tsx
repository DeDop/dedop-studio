import * as React from "react";

import {Classes, ITreeNode, Tree} from "@blueprintjs/core";
import {Configuration, OutputFile, State} from "../state";
import {connect} from "react-redux";
import * as selector from "../selectors";
import {Dispatch} from "redux";
import {updateConfigSelection, updateSelectedOutputs} from "../actions";
import {shell} from "electron";
import * as path from "path";

export interface IOutputFilesTreeMenuProps {
    dispatch?: Dispatch<State>;
    configurations?: Configuration[];
    selectedConfigurationName?: string;
    selectedOutputFiles?: OutputFile[];
    currentWorkspaceName?: string;
    currentWorkspaceDirectory?: string;
}

function mapStateToProps(state: State): IOutputFilesTreeMenuProps {
    return {
        configurations: selector.getAllConfigurations(state),
        selectedConfigurationName: state.control.selectedConfigurationName,
        selectedOutputFiles: state.control.selectedOutputFiles,
        currentWorkspaceName: state.control.currentWorkspaceName,
        currentWorkspaceDirectory: selector.getWorkspaceDirectory(state)
    }
}

class OutputFilesTreeMenu extends React.Component<IOutputFilesTreeMenuProps, any> {
    public constructor(props) {
        super(props);
        let nodes: ITreeNode[] = [];
        for (let config of props.configurations) {
            const outputFilesNode = OutputFilesTreeMenu.constructOutputFilesNode(config, props.selectedOutputFiles, props.currentWorkspaceDirectory);
            const isExpanded = config.name == props.selectedConfigurationName;
            const configNode = OutputFilesTreeMenu.constructConfigNode(config, props, outputFilesNode, isExpanded);
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
            const outputFilesNode = OutputFilesTreeMenu.constructOutputFilesNode(config, nextProps.selectedOutputFiles, nextProps.currentWorkspaceDirectory);
            const isExpanded = this.state.nodes[nodeIndex].isExpanded || config.name == nextProps.selectedConfigurationName;
            const configNode = OutputFilesTreeMenu.constructConfigNode(config, nextProps, outputFilesNode, isExpanded);
            nodes.push(configNode)
        }
        this.state = {
            nodes: nodes
        }
    }

    private static constructOutputFilesNode(config: Configuration, selectedOutputFiles: OutputFile[], currentWorkspaceDirectory: string) {
        const outputFilesNode: ITreeNode[] = [];
        if (config.outputs) {
            for (let outputFileName of config.outputs) {
                let outputFileIndex = -1;
                if (selectedOutputFiles) {
                    outputFileIndex = selectedOutputFiles.findIndex((x) => x.name == outputFileName);
                }
                const isSelected = outputFileIndex > -1 && selectedOutputFiles[outputFileIndex].config == config.name;
                const handleOpenExplorer = () => {
                    shell.showItemInFolder(path.join(currentWorkspaceDirectory, "configs", config.name, "outputs", outputFileName));
                };
                const openExplorerIcon = <span className="pt-icon-standard pt-icon-folder-open"
                                               title="show in explorer"
                                               onClick={handleOpenExplorer}
                />;
                outputFilesNode.push({
                    id: outputFileName,
                    label: outputFileName,
                    iconName: 'pt-icon-document',
                    isSelected: isSelected,
                    secondaryLabel: openExplorerIcon
                });
            }
        }
        return outputFilesNode;
    }

    private static constructConfigNode(config: Configuration,
                                       props: IOutputFilesTreeMenuProps,
                                       outputFilesNode: ITreeNode[],
                                       isExpanded: boolean) {
        const style = config.name == props.selectedConfigurationName ? 'dedop-output-files-bold' : '';
        return {
            id: config.name,
            label: config.name,
            hasCaret: true,
            isExpanded: isExpanded,
            childNodes: outputFilesNode,
            className: style
        };
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

    private getSelectedOutputFiles(): Set<OutputFile> {
        let selectedOutputFiles: Set<OutputFile> = new Set();
        for (let configNode of this.state.nodes) {
            for (let outputFileNameNode of configNode.childNodes) {
                if (outputFileNameNode.isSelected) {
                    selectedOutputFiles.add({
                        name: outputFileNameNode.id,
                        config: configNode.id,
                        workspace: this.props.currentWorkspaceName
                    });
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
            <div style={{height: 'calc(100% - 40px)', overflow: 'auto'}}>
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
