import React, { useEffect, useState } from "react";
import { firebase } from "../../firebase";

const Playground: React.FC = () => {
  // the componet can be in 3 states
  // error - something went wrong
  // loading -- we are still loading the data
  // loaded -- we have the date in the matches

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // FYI this is special trick, anonymous function which is directly called - we need cos of compiler
    (async () => {
      // prepare the payload - you can modify the ID but it has to be in this format
      const payLoad = { profileName: "/steam/76561198034318060" };

      // prepare the CF
      const getMatchesFromRelic = firebase.functions().httpsCallable("getPlayerMatchesFromRelic");

      try {
        // call the CF
        const matches = await getMatchesFromRelic(payLoad);
        // we have the data let's save it into the state
        console.log(matches.data["playerMatches"]);

        setIsLoaded(true);
        setMatches(matches.data["playerMatches"]);
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        {matches.map((match) => {
          return (
            <div>
              {`${match["id"]}   ${match["mapname"]}`}
              <br />
            </div>
          );
        })}
      </div>
    );
  }
};

export default Playground;
