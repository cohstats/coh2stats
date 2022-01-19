import * as React from "react";
import { useSelector } from "react-redux";
import { selectMatch } from "../../../redux/slice";
import MatchOverview from "../../components/MatchOverview";

const App = (): JSX.Element => {
  const matchData = useSelector(selectMatch);

  return (
    <>
      <MatchOverview match={matchData} />
    </>
  );
};

export default App;
