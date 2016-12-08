import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {createStore} from 'redux';

import {
    HGLContainer, HGLHeader, HGLFooter,
    HGLCenter
} from './components/Components';
import {MainTabs} from './components/Tabs';
import TopMenu from './components/TopMenu';
import {reducers} from './reducers';

export function main() {

    const store = createStore(reducers);

    ReactDOM.render(
        <Provider store={store}>
            <HGLContainer>
                <HGLHeader>
                    <TopMenu/>
                </HGLHeader>
                <HGLCenter>
                    <MainTabs/>
                </HGLCenter>
                <HGLFooter>
                    <div className="footer-developed-by">developed by Brockmann Consult GmbH</div>
                    <div className="footer-core-status">
                        <span className="core-status-text">dedop-core</span>
                        <span className="pt-icon pt-icon-disable"/>
                    </div>
                </HGLFooter>
            </HGLContainer>
        </Provider>,
        document.getElementById('container')
    );
}


