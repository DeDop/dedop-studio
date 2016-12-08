import * as React from "react";

export default class TopMenu extends React.Component<any, any> {
    public render() {
        return (
            <nav className="pt-navbar .modifier">
                <div className="pt-navbar-group pt-align-left">
                    <img src="resources/dedop-32.png"/>
                    <div className="pt-navbar-heading dedop-menu-title">DeDop Studio</div>
                </div>
            </nav>
        )
    }
}
