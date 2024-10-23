import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import routes from "../../routes";
import { getPreviousWeekTimeStamp, useQuery } from "../../utils/helpers";
import { Link, Routes, Route } from "react-router-dom";

/**
 * This is old stats format, it's used for redirect from the old links
 *
 */
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
    <Routes>
      <Route path={"/stats/"}>
        <Link
          to={routes.fullStatsOldDetails("week", getPreviousWeekTimeStamp(), "4v4", "wermacht")}
        />
      </Route>
    </Routes>
  );
};

export default OldStats;
