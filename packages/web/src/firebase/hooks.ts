import { useSelector } from "react-redux";

// Types
import type { AppState } from "../store";

export const useLoading = (query: string | string[]): boolean =>
  useSelector<AppState, boolean>((state) => {
    if (query instanceof Array) {
      return query.some(
        (entry) =>
          !state.firestore.status.requested[entry] && state.firestore.status.requesting[entry],
      );
    }
    const result =
      !state.firestore.status.requested[query] && state.firestore.status.requesting[query];
    return result === undefined ? true : result;
  });

export const useData = <Result = Record<string, unknown>>(
  query: string,
  subSelector?: string | string[],
): Result =>
  useSelector<AppState, Result>((state) => {
    if (subSelector instanceof Array) {
      // Used for getting multiple subItems including their ids for example
      return subSelector.map((id) => id && { ...state.firestore.data[query]?.[id], id });
    }
    return subSelector ? state.firestore.data[query]?.[subSelector] : state.firestore.data[query];
  });
