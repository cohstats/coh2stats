import React, { useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { useHistory, useParams } from "react-router";
import routes from "../../routes";
import { getPreviousWeekTimeStamp } from "../../utils/helpers";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OldStats: React.FC = () => {
  const { frequency, timestamp, type, race } = useParams<{
    frequency: string;
    timestamp: string;
    type: string;
    race: string;
  }>();
  const { push } = useHistory();

  const query = useQuery();

  const statsSourceQuery = query.get("statsSource");

  useEffect(() => {
    const searchValue = `?${new URLSearchParams({
      range: frequency || "",
      statsSource: statsSourceQuery || "all",
      type: type || "",
      race: race || "",
      timeStamp: timestamp,
    })}`;

    push({
      pathname: routes.statsBase(),
      search: searchValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Switch>
      <Route path={"/stats/"}>
        <Redirect
          to={routes.fullStatsOldDetails("week", getPreviousWeekTimeStamp(), "4v4", "wermacht")}
        />
      </Route>
    </Switch>
  );
};

export default OldStats;
