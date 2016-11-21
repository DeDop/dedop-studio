import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    HGLContainer, HGLHeader, HGLFooter,
    HGLCenter
} from './components';
import {Classes, ITreeNode, Tooltip, Tree, Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import TreeMenu from "./treeMenu";
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
                <p>developed by Brockmann Consult GmbH</p>
            </HGLFooter>
        </HGLContainer>,
        document.getElementById('container')
    );
}


