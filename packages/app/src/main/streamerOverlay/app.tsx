import React from "react";
import { ApplicationState } from "../../redux/state";
import CenterView from "./centerView";
import LeftView from "./leftView";
import LoadingView from "./loadingView";

interface Props {
  state: ApplicationState;
}

const App: React.FC<Props> = ({ state }) => {
  const game = state.game;
  return (
    <>
      {game.state === "ingame" ? (
        <>
          {state.settings.streamOverlayPosition === "top" ? (
            <CenterView game={game} />
          ) : (
            <LeftView game={game} />
          )}
        </>
      ) : null}
      {game.state === "loading" ? (
        <>
          <LoadingView game={game} />
        </>
      ) : null}
    </>
  );
};

export default App;
