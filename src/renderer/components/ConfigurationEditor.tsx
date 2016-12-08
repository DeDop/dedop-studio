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
                    <InputGroup className="config-textbox"
                                placeholder={this.props.configuration.value ? this.props.configuration.value.toString() : ""}
                        {...this.props.configuration.units ? {rightElement: unitTag} : {}}/>
                </td>
            </tr>
        )
    }
}

export class ConfigurationFlagSingleEntry extends React.Component<IConfigProps, any> {
    public render() {
        return (
            <Tooltip content={this.props.configuration.description}>
                <label className="pt-control pt-checkbox">
                    <input type="checkbox" checked={!!this.props.configuration.value}/>
                    <span className="pt-control-indicator"/>
                    {this.props.configName}
                </label>
            </Tooltip>
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
            configurationElements.push(<ConfigurationSingleEntry key={i} configName={i}
                                                                 configuration={configurations[i]}/>)
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

export class CnfConfigurationEditor extends React.Component<IConfigEditorProps, any> {
    public render() {
        let propertiesElements: Array<JSX.Element> = [];
        let flagElements: Array<JSX.Element> = [];
        const configurations = this.props.configurations;
        for (let i in configurations) {
            if (configurations[i].units !== 'flag') {
                propertiesElements.push(<ConfigurationSingleEntry key={i} configName={i}
                                                                  configuration={configurations[i]}/>);
            } else {
                flagElements.push(<ConfigurationFlagSingleEntry key={i} configName={i}
                                                                configuration={configurations[i]}/>);
            }
        }

        return (
            <div>
                <h4>Properties</h4>
                <table>
                    <tbody>
                    {propertiesElements}
                    </tbody>
                </table>
                <h4>Flags</h4>
                {flagElements}
            </div>
        )
    }
}
