import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// Types
import type { Action, Reducer } from "redux";
import type { History } from "history";
import type { RouterState } from "connected-react-router";

// interface UserProfile {
//   name: string;
// }
export interface AppState {
  // React Router
  readonly router: RouterState;

  // Firebase
  // readonly firestore: FirestoreReducer.Reducer;
  // readonly firebase: FirebaseReducer.Reducer<UserProfile>;
}

export type RootReducer = Reducer<AppState, Action>;

const rootReducer = (history: History): RootReducer =>
  combineReducers<AppState>({
    router: connectRouter(history),
    // firebase: firebaseReducer,
    // firestore: firestoreReducer as Reducer,
  });

export default rootReducer;
