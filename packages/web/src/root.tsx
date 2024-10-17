import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";

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
        <ConfigsProvider configJson={{}}>
           <App />
          </ConfigsProvider>
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>
);

export default Root;
