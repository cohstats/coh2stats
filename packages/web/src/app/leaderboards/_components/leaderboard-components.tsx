import { isTeamGame } from "../../../coh/helpers";
import React from "react";
import Image from "next/image";
import { isAfter, isBefore, isMonday } from "date-fns";
import subDays from "date-fns/subDays";

// Import race icons
import wermachtIcon from "../../../../public/resources/generalIcons/wermacht.png";
import wgermanIcon from "../../../../public/resources/generalIcons/wgerman.png";
import sovietIcon from "../../../../public/resources/generalIcons/soviet.png";
import britishIcon from "../../../../public/resources/generalIcons/british.png";
import usfIcon from "../../../../public/resources/generalIcons/usf.png";

// Create a mapping for race icons
const raceIconMap = {
  wermacht: wermachtIcon,
  wehrmacht: wermachtIcon, // Handle the typo variant
  wgerman: wgermanIcon,
  soviet: sovietIcon,
  british: britishIcon,
  usf: usfIcon,
} as const;

const generateIconsForTitle = (race: string, type: string) => {
  if (isTeamGame(type)) {
    if (race === "axis") {
      return (
        <>
          <Image src={wermachtIcon} height={24} alt={race} />
          <Image src={wgermanIcon} height={24} alt={race} />
        </>
      );
    } else {
      return (
        <>
          <Image src={sovietIcon} height={24} alt={race} />
          <Image src={britishIcon} height={24} alt={race} />
          <Image src={usfIcon} height={24} alt={race} />
        </>
      );
    }
  } else if (race !== "axis" && race !== "allies") {
    const iconSrc = raceIconMap[race as keyof typeof raceIconMap];
    if (iconSrc) {
      return <Image src={iconSrc} height={24} alt={race} />;
    }
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
