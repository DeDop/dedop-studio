import * as React from 'react';
import {InputGroup, Tag, Classes, Tooltip} from "@blueprintjs/core";
import {ProcessConfigurations, ConfigurationItem} from "../state";

interface IConfigProps {
    configName: string;
    configuration: ConfigurationItem;
    onChange: (event: any) => void;
}

export class ConfigurationSingleEntry extends React.Component<IConfigProps,any> {
    constructor(props) {
        super(props);
        this.state = {
            localValue: this.props.configuration.value ? this.props.configuration.value.toString() : ""
        };
    }

    componentWillReceiveProps(nextProps) {
        const value = nextProps.configuration.value ? nextProps.configuration.value.toString() : "";
        this.setState({
            localValue: value
        })
    }

    public render() {
        const unitTag = (
            <Tag className={Classes.MINIMAL}>{this.props.configuration.units}</Tag>
        );

        const handleOnChange = (event: any) => {
            const value = event.currentTarget.value;
            this.setState({
                localValue: value
            });
        };

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
                                name={this.props.configName}
                                value={this.state.localValue}
                        {...this.props.configuration.units ? {rightElement: unitTag} : {}}
                                onChange={handleOnChange}
                    />
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
    handleInputChange: (event: React.FormEvent<HTMLSelectElement>) => void;
}

export class ConfigurationEditor extends React.Component<IConfigEditorProps, any> {
    public render() {
        let configurationElements: Array<JSX.Element> = [];
        const configurations = this.props.configurations;
        for (let i in configurations) {
            configurationElements.push(<ConfigurationSingleEntry key={i}
                                                                 configName={i}
                                                                 configuration={configurations[i]}
                                                                 onChange={this.props.handleInputChange}
            />)
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
                propertiesElements.push(<ConfigurationSingleEntry key={i}
                                                                  configName={i}
                                                                  configuration={configurations[i]}
                                                                  onChange={this.props.handleInputChange}
                />);
            } else {
                flagElements.push(<ConfigurationFlagSingleEntry key={i}
                                                                configName={i}
                                                                configuration={configurations[i]}
                                                                onChange={this.props.handleInputChange}
                />);
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
                <div className="config-flag-panel">
                    {flagElements}
                </div>
            </div>
        )
    }
}
