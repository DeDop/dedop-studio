import * as React from 'react';
import {InputGroup, Tag, Classes, Tooltip} from "@blueprintjs/core";
import {ProcessConfiguration} from "../state";

interface IConfigProps {
    configName: string;
    defaultValue: string;
    unit?: string;
}

export class ConfigurationSingleEntry extends React.Component<IConfigProps,any> {
    public render() {
        const unitTag = (
            <Tag className={Classes.MINIMAL}>{this.props.unit}</Tag>
        );

        return (
            <tr>
                <td>
                    <Tooltip content={this.props.configName}>
                        <label className="pt-label pt-inline">
                            {this.props.configName}
                        </label>
                    </Tooltip>
                </td>
                <td>
                    <InputGroup className="config-textbox" placeholder={this.props.defaultValue}
                        {...this.props.unit ? {rightElement: unitTag} : {}}/>
                </td>
            </tr>
        )
    }
}

interface IConfigEditorProps {
    configurations: Array<ProcessConfiguration>;
}

export class ConfigurationEditor extends React.Component<IConfigEditorProps, any> {
    public render() {
        return (
            <table>
                <tbody>
                <ConfigurationSingleEntry configName="freq_ku_chd" defaultValue="13575000000.0"
                                          unit="Hz"/>
                <ConfigurationSingleEntry configName="bw_ku_chd" defaultValue="320000000" unit="Hz"/>
                <ConfigurationSingleEntry configName="pri_sar_chd" defaultValue="5.610000296769016e-05"
                                          unit="s"/>
                <ConfigurationSingleEntry configName="mean_sat_alt_chd" defaultValue="1347000.0"
                                          unit="m"/>
                </tbody>
            </table>
        )
    }

}
