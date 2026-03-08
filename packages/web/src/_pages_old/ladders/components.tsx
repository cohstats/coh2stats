import { getGeneralIconPath, isTeamGame } from "../../coh/helpers";
import { RaceName } from "../../coh/types";
import React from "react";
import { isAfter, isBefore, isMonday } from "date-fns";
import subDays from "date-fns/subDays";

const generateIconsForTitle = (race: string, type: string) => {
  if (isTeamGame(type)) {
    if (race === "axis") {
      return (
        <>
          <img src={getGeneralIconPath("wehrmacht")} height="24px" alt={race} />
          <img src={getGeneralIconPath("wgerman")} height="24px" alt={race} />
        </>
      );
    } else {
      return (
        <>
          <img src={getGeneralIconPath("soviet")} height="24px" alt={race} />
          <img src={getGeneralIconPath("british")} height="24px" alt={race} />
          <img src={getGeneralIconPath("usf")} height="24px" alt={race} />
        </>
      );
    }
  } else if (race !== "axis" && race !== "allies") {
    return <img src={getGeneralIconPath(race as RaceName)} height="24px" alt={race} />;
  }
};

const disabledDate = (current: Date) => {
  // we started logging Monday 8.3.2021
  const canBeOld = isBefore(current, new Date(2021, 2, 8));
  const canBeNew = isAfter(current, new Date());

  const isOldExceptMonday =
    current.getTime() < subDays(new Date(), 60).getTime() && !isMonday(current);

  return canBeOld || canBeNew || isOldExceptMonday;
};

export { generateIconsForTitle, disabledDate };
