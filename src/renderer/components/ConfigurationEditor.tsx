import * as React from 'react';
import {InputGroup, Tag, Classes, Tooltip} from "@blueprintjs/core";
import {ProcessConfigurations, ConfigurationItem} from "../state";

interface IConfigProps {
    configName: string;
    configuration: ConfigurationItem;
}

export class ConfigurationSingleEntry extends React.Component<IConfigProps,any> {
    public render() {
        const unitTag = (
            <Tag className={Classes.MINIMAL}>{this.props.configuration.units}</Tag>
        );

        return (
            <tr>
                <td>
                    <Tooltip content={this.props.configuration.description}>
                        <label className="pt-label pt-inline">
                            {this.props.configName}
                        </label>
                    </Tooltip>
                </td>
                <td>
                    <InputGroup className="config-textbox" placeholder={this.props.configuration.value.toString()}
                        {...this.props.configuration.units ? {rightElement: unitTag} : {}}/>
                </td>
            </tr>
        )
    }
}

interface IConfigEditorProps {
    configurations: ProcessConfigurations;
}

export class ConfigurationEditor extends React.Component<IConfigEditorProps, any> {
    public render() {
        let configurationElements: Array<JSX.Element> = [];
        const configurations = this.props.configurations;
        for (let i in configurations) {
            configurationElements.push(<ConfigurationSingleEntry configName={i} configuration={configurations[i]}/>)
        }

        return (
            <table>
                <tbody>
                {configurationElements}
                </tbody>
            </table>
        )
    }

}
