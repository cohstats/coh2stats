import * as React from "react";
import { useSelector } from "react-redux";
import { selectGame } from "../../../redux/slice";
import GameOverview from "../../components/GameOverview";

const App = (): JSX.Element => {
  const gameData = useSelector(selectGame);

  return (
    <>
      <GameOverview game={gameData} />
    </>
  );
};

export default App;
