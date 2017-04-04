import * as React from "react";
import {InputGroup, Tag, Classes, Tooltip, Position} from "@blueprintjs/core";
import {ProcessConfigurations, ConfigurationItem} from "../state";

interface IConfigProps {
    configName: string;
    configuration: ConfigurationItem;
    onBlur: (event: any) => void;
}

export class ConfigurationSingleEntry extends React.Component<IConfigProps,any> {
    constructor(props: IConfigProps) {
        super(props);
        this.state = {
            localValue: this.props.configuration.value ? this.props.configuration.value.toString() : ""
        };
    }

    componentWillReceiveProps(nextProps: IConfigProps) {
        const value = nextProps.configuration.value ? nextProps.configuration.value.toString() : "";
        this.setState({
            localValue: value
        })
    }

    public render() {
        const unitTag = (
            <Tag className={Classes.MINIMAL} style={{paddingRight: '5px'}}>{this.props.configuration.units}</Tag>
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
                    <Tooltip content={this.props.configuration.description} position={Position.LEFT}>
                        <label className="pt-label pt-inline">
                            {this.props.configName}
                        </label>
                    </Tooltip>
                </td>
                <td>
                    <InputGroup className="config-textbox"
                                name={this.props.configName}
                                value={this.state.localValue}
                        {...this.props.configuration.units ? {rightElement: unitTag} : {
                                rightElement: <span style={{paddingRight: '5px'}}/>
                            }}
                                onChange={handleOnChange}
                                onBlur={this.props.onBlur}
                    />
                </td>
            </tr>
        )
    }
}

export class ConfigurationFlagSingleEntry extends React.Component<IConfigProps, any> {

    constructor(props: IConfigProps) {
        super(props);
        this.state = {
            checked: !!this.props.configuration.value
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: !!nextProps.configuration.value
        })
    }

    public render() {
        const handleFlagChange = () => {
            this.setState({
                checked: !this.state.checked
            })
        };

        return (
            <Tooltip content={this.props.configuration.description} position={Position.LEFT}>
                <label className="pt-control pt-checkbox">
                    <input type="checkbox"
                           name={this.props.configName}
                           checked={this.state.checked}
                           onChange={handleFlagChange}
                           onBlur={this.props.onBlur}
                    />
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
        let configurationElements = [];
        const configurations = this.props.configurations;
        for (let i in configurations) {
            if (i == "__metainf__") {
                continue;
            }
            configurationElements.push(<ConfigurationSingleEntry key={i}
                                                                 configName={i}
                                                                 configuration={configurations[i]}
                                                                 onBlur={this.props.handleInputChange}
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
        let propertiesElements = [];
        let flagElements = [];
        const configurations = this.props.configurations;
        for (let i in configurations) {
            if (i == "__metainf__") {
                continue;
            }
            if (configurations[i].units !== 'flag') {
                propertiesElements.push(<ConfigurationSingleEntry key={i}
                                                                  configName={i}
                                                                  configuration={configurations[i]}
                                                                  onBlur={this.props.handleInputChange}
                />);
            } else {
                flagElements.push(<ConfigurationFlagSingleEntry key={i}
                                                                configName={i}
                                                                configuration={configurations[i]}
                                                                onBlur={this.props.handleInputChange}
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
