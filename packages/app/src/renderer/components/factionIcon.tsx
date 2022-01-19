import React from "react";
// tell webpack to import these images
// TODO: find a cleaner solution
import aef from "../../../assets/generalIcons/aef.png";
import aef_ai from "../../../assets/generalIcons/aef_ai.png";
import british from "../../../assets/generalIcons/british.png";
import british_ai from "../../../assets/generalIcons/british_ai.png";
import german from "../../../assets/generalIcons/german.png";
import german_ai from "../../../assets/generalIcons/german_ai.png";
import soviet from "../../../assets/generalIcons/soviet.png";
import soviet_ai from "../../../assets/generalIcons/soviet_ai.png";
import west_german from "../../../assets/generalIcons/west_german.png";
import west_german_ai from "../../../assets/generalIcons/west_german_ai.png";

interface Props {
  faction: string;
  ai: boolean;
  style?: React.CSSProperties;
}
export const FactionIcon: React.FC<Props> = ({ faction, ai, style }) => {
  const lookupTable: Record<string, string> = {
    german: german,
    soviet: soviet,
    west_german: west_german,
    aef: aef,
    british: british,
  };
  if (ai) {
    lookupTable.german = german_ai;
    lookupTable.soviet = soviet_ai;
    lookupTable.west_german = west_german_ai;
    lookupTable.aef = aef_ai;
    lookupTable.british = british_ai;
  }

  return (
    <>
      <img src={lookupTable[faction]} style={style} alt={faction} />
    </>
  );
};
