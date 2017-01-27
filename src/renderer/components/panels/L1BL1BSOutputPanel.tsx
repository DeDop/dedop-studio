import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";

export class L1BL1BSOutputPanel extends React.Component<any,any> {
    render() {
        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="L1B & L1BS Output" icon="pt-icon-document"/>
                <div className="dedop-panel-content">
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                Output directory
                            </td>
                            <td style={{width: '100%'}}>
                                <label className="pt-file-upload pt-fill l1a-input-file-upload">
                                    <input type="file"/>
                                    <span className="pt-file-upload-input">
                                            Choose directory...
                                        </span>
                                </label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
