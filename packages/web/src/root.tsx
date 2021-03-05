import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { Route, Switch } from "react-router-dom";
import { createFirestoreInstance } from "redux-firestore";

// Firebase
import firebase from "firebase/app";

// Local
import config from "./config";
// import { AuthRoute } from "./authentication";

// Subcomponents
import App from "./App";
// import { Login } from "./authentication";
// import { NotFound } from "./pages";
// import routes from "./routes";

// Types
import type { AppStore } from "./store";
import type { History } from "history";
// import { Loading } from "./components";

interface Props {
    store: AppStore;
    history: History;
}
const Root: React.FC<Props> = ({ store, history }) => (
    <Provider store={store}>
        <ReactReduxFirebaseProvider
            firebase={firebase}
            config={config.rrfConfig}
            dispatch={store.dispatch}
            createFirestoreInstance={createFirestoreInstance}
        >
            <ConnectedRouter history={history}>
                <React.StrictMode>
                    <Switch>
                        <Route path={"/login"}>LOGIN</Route>
                        <Route path="/">
                            <App />
                        </Route>
                        <Route>NOT FOUND</Route>
                    </Switch>
                </React.StrictMode>
            </ConnectedRouter>
        </ReactReduxFirebaseProvider>
    </Provider>
);

export default Root;
