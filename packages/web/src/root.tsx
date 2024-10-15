import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { CompatRoute, CompatRouter } from "react-router-dom-v5-compat";

// Subcomponents
import App from "./App";

// Types
import type { AppStore } from "./store";
import type { History } from "history";
import { ConfigsProvider } from "./config-context";

interface Props {
  store: AppStore;
  history: History;
}
const Root: React.FC<Props> = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <React.StrictMode>
        <Switch>
          <CompatRoute path="/login">LOGIN</CompatRoute>
          <Route path="/">
            <ConfigsProvider configJson={{}}>
              <App />
            </ConfigsProvider>
          </Route>
          {/* <CompatRoute path="/" configJson={{}}>
            <App />
          </CompatRoute> */}
          <CompatRoute>NOT FOUND</CompatRoute>
        </Switch>
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>
);

export default Root;
