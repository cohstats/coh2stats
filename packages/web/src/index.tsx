import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";

import store from "./store";

import "./index.css";
import { firebase } from "./firebase";
import Root from "./root";

// Initialize Firebase
firebase.init();

const history = createBrowserHistory();

// Redux store with persistor
export const appStore = store.configure(history);

const renderApp = (): void =>
    ReactDOM.render(
        <React.StrictMode>
            <Root store={appStore} history={history} />
        </React.StrictMode>,
        document.getElementById("root"),
    );

// Hot reload
if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./root", renderApp);
}

// Render our app
renderApp();
