import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware as createRouterMiddleware } from "connected-react-router";

// Local
import rootReducer from "./reducer";

// Types
import type { Action, Middleware, Store, StoreEnhancer } from "redux";
import type { AppState } from "./reducer";
import type { EnhancerOptions } from "redux-devtools-extension";
import type { History } from "history";

export type AppStore = Store<AppState, Action>;

const configureStore = (history: History): AppStore => {
    // Middlewares
    const routerMiddleware = createRouterMiddleware(history);
    const middlewares: Middleware[] = [routerMiddleware];

    // All midlewares as enhancer
    const middlewareEnhancer = applyMiddleware(...middlewares);

    // All enhancers
    const enhancers = [middlewareEnhancer];

    // Devtools options
    const devToolsOptions: EnhancerOptions = {
        trace: true,
        traceLimit: 25,
    };

    // Compose with devtools
    const compose = composeWithDevTools(devToolsOptions);

    // Compose all enhancers
    const composedEnhancers: StoreEnhancer = compose(...enhancers);

    // Create store
    const store = createStore(rootReducer(history), composedEnhancers);

    // Hot reload reducer
    if (process.env.NODE_ENV !== "production" && module.hot) {
        module.hot.accept("./reducer", () => store.replaceReducer(rootReducer(history)));
    }

    return store;
};

export default configureStore;
