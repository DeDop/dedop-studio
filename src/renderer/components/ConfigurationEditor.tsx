import * as React from "react";
import {Classes, InputGroup, Tag} from "@blueprintjs/core";
import {ConfigurationItem, ProcessConfigurations, State} from "../state";
import {Dispatch} from "redux";
import {updateUnsavedConfigStatus} from "../actions";

interface IConfigProps {
    dispatch: Dispatch<State>;
    configName: string;
    configuration: ConfigurationItem;
    disabled: boolean;
    onBlur: (event: any) => void;
}

export class ConfigurationSingleEntry extends React.Component<IConfigProps, any> {
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
            if (value != this.props.configuration.value) {
                this.props.dispatch(updateUnsavedConfigStatus(true));
                this.props.onBlur(event);
            }
        };

        return (
            <tr>
                <td>
                    <label className="pt-label pt-inline" title={this.props.configuration.description}>
                        {this.props.configName}
                    </label>
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
                                disabled={this.props.disabled}
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
        const handleFlagChange = (event: any) => {
            const checked = event.currentTarget.checked;
            this.setState({
                checked: !this.state.checked
            });
            if (checked != this.state.checked) {
                this.props.dispatch(updateUnsavedConfigStatus(true));
                this.props.onBlur(event);
            }
        };

        return (
            <label className="pt-control pt-checkbox" title={this.props.configuration.description}>
                <input type="checkbox"
                       name={this.props.configName}
                       checked={this.state.checked}
                       disabled={this.props.disabled}
                       onChange={handleFlagChange}
                       onBlur={this.props.onBlur}
                />
                <span className="pt-control-indicator"/>
                {this.props.configName}
            </label>
        )
    }
}

interface IConfigEditorProps {
    dispatch: Dispatch<State>;
    configurations: ProcessConfigurations;
    disabled: boolean;
    handleInputChange: (event: React.FormEvent<HTMLSelectElement>) => void;
}

export class ConfigurationEditor extends React.Component<IConfigEditorProps, any> {
    public render() {
        let propertiesElements = [];
        let flagElements = [];
        const configurations = this.props.configurations;
        for (let i in configurations) {
            if (i == "__metainf__") {
                continue;
            }
            if (configurations[i].description && configurations[i].description.toLowerCase() == "not yet implemented") {
                continue;
            }
            if (configurations[i].units === 'flag' && typeof(configurations[i].value) === "boolean") {
                flagElements.push(<ConfigurationFlagSingleEntry key={i}
                                                                configName={i}
                                                                configuration={configurations[i]}
                                                                disabled={this.props.disabled}
                                                                onBlur={this.props.handleInputChange}
                                                                dispatch={this.props.dispatch}
                />);
            } else {
                propertiesElements.push(<ConfigurationSingleEntry key={i}
                                                                  configName={i}
                                                                  configuration={configurations[i]}
                                                                  disabled={this.props.disabled}
                                                                  onBlur={this.props.handleInputChange}
                                                                  dispatch={this.props.dispatch}
                />);
            }
        }

        return (
            <div>
                <table>
                    <tbody>
                    {propertiesElements}
                    </tbody>
                </table>
                <div className="config-flag-panel">
                    {flagElements}
                </div>
            </div>
        )
    }
}
