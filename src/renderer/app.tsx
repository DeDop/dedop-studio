import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {createStore} from 'redux';

import {
    HGLContainer, HGLHeader, HGLFooter,
    HGLCenter
} from './components/Components';
import MainTabs from './components/Tabs';
import TopMenu from './components/TopMenu';
import {reducers} from './reducers';
import WorkflowBreadcrumb from "./components/WorkflowBreadcrumb";

export function main() {

    const store = createStore(reducers);

    ReactDOM.render(
        <Provider store={store}>
            <HGLContainer>
                <HGLHeader>
                    <TopMenu/>
                </HGLHeader>
                <WorkflowBreadcrumb/>
                <HGLCenter>
                    <MainTabs/>
                </HGLCenter>
                <HGLFooter>
                    <div style={{margin: '0 0 0 10px'}}>Ready.</div>
                    {/*<div className="footer-core-status">
                     <span className="core-status-text">dedop-core</span>
                     <span className="pt-icon pt-icon-disable"/>
                     </div>*/}
                </HGLFooter>
            </HGLContainer>
        </Provider>,
        document.getElementById('container')
    );
}


