import * as React from "react";
import {OrdinaryPanelHeader} from "./PanelHeader";

export class L1BL1BSOutputPanel extends React.Component<any,any> {
    render() {
        return (
            <div className="dedop-collapse vertical-third">
                <OrdinaryPanelHeader title="L1B & L1BS Output" icon="pt-icon-document"/>
                <div className="dedop-panel-content">
                    <table width='100%'>
                        <tbody>
                        <tr>
                            <td width='20%'>
                                Output directory
                            </td>
                            <td width='80%'>
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
