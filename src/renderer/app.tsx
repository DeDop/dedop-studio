import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    HGLContainer, HGLHeader, HGLFooter,
    HGLCenter
} from './components';
import {MainTabs} from './tabList';
import TopMenu from './topMenu';

export function main() {
    ReactDOM.render(
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
        </HGLContainer>,
        document.getElementById('container')
    );
}


