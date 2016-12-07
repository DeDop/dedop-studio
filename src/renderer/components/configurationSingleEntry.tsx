import * as React from 'react';
import {InputGroup, Tag, Classes} from "@blueprintjs/core";

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
                    <label className="pt-label pt-inline">
                        {this.props.configName}
                    </label>
                </td>
                <td>
                    <InputGroup className="config-textbox" placeholder={this.props.defaultValue}
                        {...this.props.unit ? {rightElement: unitTag} : {}}/>
                </td>
            </tr>
        )
    }
}
