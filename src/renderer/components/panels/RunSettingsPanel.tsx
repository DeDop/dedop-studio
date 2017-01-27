import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";

export class RunSettingsPanel extends React.Component<any,any> {
    render() {
        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="Run Settings" icon="pt-icon-properties"/>
                <div className="dedop-panel-content">
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                Name
                            </td>
                            <td style={{width: '100%'}}>
                                <input className="pt-input pt-fill" type="text" placeholder="Process name"
                                       dir="auto"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Configuration
                            </td>
                            <td style={{width: '100%'}}>
                                <div className="pt-select pt-fill">
                                    <select>
                                        <option selected>Select a configuration...</option>
                                        <option value="1">Alternate Delay-Doppler Processing</option>
                                        <option value="2">Modified Surface Locations</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
