import * as React from 'react'
import {ConfigurationFile, State} from "../../state";
import {connect} from "react-redux";

export interface IConfigurationSelectionProps {
    configurations: ConfigurationFile[];
}

function mapStateToProps(state: State): IConfigurationSelectionProps {
    return {
        configurations: state.data.configurations
    };
}

class ConfigurationSelection extends React.Component<IConfigurationSelectionProps,any> {
    public render() {

        let configurationSelectionItem: Array<JSX.Element> = [];
        const configurations = this.props.configurations;
        for (let i in configurations) {
            configurationSelectionItem.push(<option value={i}>{configurations[i].name}</option>)
        }

        return (
            <div className="pt-select dedop-dialog-parameter-item">
                    <span className="dedop-dialog-parameter-label">
                                Base configuration
                            </span>
                <select className="dedop-dialog-parameter-input">
                    {configurationSelectionItem}
                </select>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ConfigurationSelection)
