import * as React from "react";
import {Configuration, State} from "../state";
import {connect} from "react-redux";
import * as selector from "../selectors";

export interface IConfigurationSelectionProps {
    configurations: Configuration[];
    onChangeSelection: (event: any) => void;
}

function mapStateToProps(state: State, ownProps): IConfigurationSelectionProps {
    return {
        configurations: selector.getAllConfigurations(state),
        onChangeSelection: ownProps.onChangeSelection
    };
}

class ConfigurationSelection extends React.Component<IConfigurationSelectionProps,any> {
    public render() {

        let configurationSelectionItem = [];
        const configurations = this.props.configurations;
        for (let i in configurations) {
            configurationSelectionItem.push(<option key={i}
                                                    value={configurations[i].name}
            >
                {configurations[i].name}
            </option>)
        }

        return (
            <div className="pt-select dedop-dialog-parameter-item">
                    <span className="dedop-dialog-parameter-label">
                                Base configuration
                            </span>
                <select className="dedop-dialog-parameter-input" onChange={this.props.onChangeSelection}>
                    {configurationSelectionItem}
                </select>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ConfigurationSelection)
