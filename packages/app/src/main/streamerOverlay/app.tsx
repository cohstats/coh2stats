import React from "react";
import { ApplicationState } from "../../redux/state";
import CenterView from "./centerView";
import LeftView from "./leftView";
import LoadingView from "./loadingView";

interface Props {
  state: ApplicationState;
}

const App: React.FC<Props> = ({ state }) => {
  const match = state.match;
  return (
    <>
      {match.started && !match.ended ? (
        <>
          {state.settings.streamOverlayPosition === "top" ? (
            <CenterView match={match} />
          ) : (
            <LeftView match={match} />
          )}
        </>
      ) : null}
      {!match.started && !match.ended ? (
        <>
          <LoadingView match={match} />
        </>
      ) : null}
    </>
  );
};

export default App;
