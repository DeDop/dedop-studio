import * as React from 'react';
import {Alert, IconName} from '@blueprintjs/core';

interface IAlertProps {
    onConfirm: () => any;
    isAlertOpen: boolean;
    message: string;
    iconName?: IconName;
    className?: string;
}

export class GeneralAlert extends React.Component<IAlertProps,any> {
    render() {
        const defaultStyle = 'dedop-alert-not-implemented';
        const defaultIcon: IconName = 'pt-icon-build';

        return (
            <Alert
                isOpen={this.props.isAlertOpen}
                onConfirm={this.props.onConfirm}
                className={this.props.className ? this.props.className: defaultStyle}
                iconName={this.props.iconName ? this.props.iconName : defaultIcon}
            >
                {this.props.message}
            </Alert>
        )
    }
}
