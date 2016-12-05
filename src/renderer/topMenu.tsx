import * as React from "react";

export default class TopMenu extends React.Component<any, any> {
    public render() {
        return (
            <nav className="pt-navbar .modifier">
                <div className="pt-navbar-group pt-align-left">
                    <img src="resources/dedop-32.png"/>
                    <div className="pt-navbar-heading dedop-menu-title">DeDop Studio</div>
                    <input className="pt-input" placeholder="Search files..." type="text"/>
                    <button className="pt-button pt-minimal pt-icon-add"/>
                    <div className="pt-button-group .modifier">
                        <a className="pt-button pt-icon-database" role="button">Queries</a>
                        <a className="pt-button pt-icon-function" role="button">Functions</a>
                        <a className="pt-button" role="button">
                            Options <span className="pt-icon-standard pt-icon-caret-down pt-align-right"/>
                        </a>
                    </div>
                    <br /><br />
                    <div className="pt-button-group .modifier">
                        <a className="pt-button pt-icon-chart" role="button"/>
                        <a className="pt-button pt-icon-control" role="button"/>
                        <a className="pt-button pt-icon-graph" role="button"/>
                        <a className="pt-button pt-icon-camera" role="button"/>
                        <a className="pt-button pt-icon-map" role="button"/>
                        <a className="pt-button pt-icon-code" role="button"/>
                        <a className="pt-button pt-icon-th" role="button"/>
                        <a className="pt-button pt-icon-time" role="button"/>
                        <a className="pt-button pt-icon-compressed" role="button"/>
                    </div>
                    <br /><br />
                    <div className="pt-button-group .modifier">
                        <button type="button" className="pt-button pt-intent-success">Save</button>
                        <button type="button" className="pt-button pt-intent-success pt-icon-caret-down"/>
                    </div>
                </div>
                <div className="pt-navbar-group pt-align-right">
                    <button className="pt-button pt-minimal pt-icon-home">Home</button>
                    <button className="pt-button pt-minimal pt-icon-document">Files</button>
                    <span className="pt-navbar-divider"/>
                    <button className="pt-button pt-minimal pt-icon-user"/>
                    <button className="pt-button pt-minimal pt-icon-notifications"/>
                    <button className="pt-button pt-minimal pt-icon-cog"/>
                </div>
            </nav>
        )
    }
}
