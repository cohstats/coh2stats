import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";

import store from "./store";

import "./index.css";
import { firebase } from "./firebase";
import Root from "./root";
import analytics from "./analytics";

// Initialize Firebase
firebase.init();

const history = createBrowserHistory();
history.listen(analytics.pageView);

const themes = {
  light: `${process.env.PUBLIC_URL}/css/antd.css`,
  dark: `${process.env.PUBLIC_URL}/css/antd.dark.css`,
};

// Redux store with persistor
export const appStore = store.configure(history);

const renderApp = (): void =>
  ReactDOM.render(
    <React.StrictMode>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme="light" insertionPoint="styles-insertion-point">
        <Root store={appStore} history={history} />
      </ThemeSwitcherProvider>
    </React.StrictMode>,
    document.getElementById("root"),
  );

// Hot reload
if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./root", renderApp);
}

// Render our app
renderApp();
