import * as React from "react";
import FormEventHandler = React.FormEventHandler;

interface ISelectComponent {
    fill?: boolean;
    selectedItem?: string;
    defaultValue?: string;
    items: string[];
    onChange?: () => any;
}

export class SelectComponent extends React.Component<ISelectComponent, any> {
    private defaultValue = this.props.defaultValue ? this.props.defaultValue : "Select an item";
    private onChange = this.props.onChange ? this.props.onChange : undefined;

    private renderItems() {
        let items = [];
        items.push(<option key="informationText" disabled>{this.defaultValue}</option>);
        for (let i in this.props.items) {
            items.push(<option key={i}>{this.props.items[i]}</option>);
        }
        return items;
    }

    private handleOnChange() {
        if (this.props.onChange) {
            this.props.onChange();
        }
    }

    render() {
        const style = this.props.fill ? "pt-select pt-fill" : "pt-select";

        return (
            <div className={style}>
                <select
                    value={this.props.selectedItem ? this.props.selectedItem : undefined}
                    defaultValue={this.defaultValue}
                    onChange={() => this.handleOnChange()}>
                    {this.renderItems()}
                </select>
            </div>
        )
    }
}
