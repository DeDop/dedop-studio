import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider, Store} from "react-redux";
import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";
import * as loggerMiddleware from "redux-logger";
import {HGLContainer, HGLHeader, HGLFooter, HGLCenter} from "./components/Components";
import MainTabs from "./components/tabs/Tabs";
import TopMenu from "./components/TopMenu";
import {reducers} from "./reducers";
import WorkflowBreadcrumb from "./components/WorkflowBreadcrumb";
import * as actions from "./actions";
import {State} from "./state";
import {newWebAPIClient} from "./webapi/WebAPIClient";
import {ipcRenderer} from "electron";
import {WebAPIServiceMock} from "./webapi/WebAPIServiceMock";
import {WebSocketMock} from "./webapi/WebSocketMock";

export function main() {

    const middleware = applyMiddleware(
        thunkMiddleware,
        loggerMiddleware({level: 'info', collapsed: true, diff: true})
    );

    const store = createStore(reducers, middleware);

    ipcRenderer.on('apply-initial-state', (event, initialState) => {
        store.dispatch(actions.applyInitialState(initialState));
        connectWebAPIClient(store);
    });
}

function connectWebAPIClient(store: Store<State>) {
    store.dispatch(actions.setWebAPIStatus(null, 'connecting'));

    const webAPIConfig = store.getState().data.appConfig.webAPIConfig;
    let webAPIClient;
    if (!webAPIConfig.useMockService && webAPIConfig.webSocketUrl) {
        webAPIClient = newWebAPIClient(webAPIConfig.webSocketUrl);
    } else {
        webAPIClient = newWebAPIClient('ws://mock', 0, new WebSocketMock(100, new WebAPIServiceMock(), true));
    }

    // TODO (forman): this code can take considerable time and is executed BEFORE the window UI shows up
    //                we urgently need to display some progress indicator beforehand.
    webAPIClient.onOpen = () => {
        store.dispatch(actions.setWebAPIStatus(webAPIClient, 'open'));
        // TODO (forman): store.dispatch(actions.loadOperations());

        store.dispatch(actions.getAllWorkspaces());
        store.dispatch(actions.getCurrentWorkspace());

        // This is a test, we keep it as a test an a code template for code that need to run later
        store.dispatch(dispatch => {
            setTimeout(() => {
                dispatch({type: 'BRING_KINDERSCHOKOLADE', payload: 'Here are 5kg Kinderschokolade'});
            }, 5000);
        });

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
    };

    webAPIClient.onClose = () => {
        store.dispatch(actions.setWebAPIStatus(null, 'closed'));
    };

    webAPIClient.onError = () => {
        store.dispatch(actions.setWebAPIStatus(webAPIClient, 'error'));
    };

    webAPIClient.onWarning = (event) => {
        console.warn(`dedop-desktop: warning from dedop-webapi: ${event.message}`);
    };
}
