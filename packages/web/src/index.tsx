import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import store from "./store";
import "./index.css";
import Root from "./root";
import analytics from "./analytics";
import "firebase/compat/firestore";
import { Metrics } from "@edgio/rum";

import { firebase } from "./firebase";

firebase.init();
// Initialize Firebase

// Collect RUM metrics
new Metrics({
  token: "cdbeca7f-be87-45d8-a36a-0ba520f1ec5c",
}).collect();

const history = createBrowserHistory();
history.listen(analytics.pageView);

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
