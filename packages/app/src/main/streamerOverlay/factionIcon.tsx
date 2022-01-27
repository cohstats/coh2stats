import React from "react";

interface Props {
  faction: string;
  ai: boolean;
  style?: React.CSSProperties;
}
export const FactionIcon: React.FC<Props> = ({ faction, ai, style }) => {
  let aiSuffix = "";
  if (ai) {
    aiSuffix = "_ai";
  }
  const imgSrc = "/assets/generalIcons/" + faction + "" + aiSuffix + ".png";

  return (
    <>
      <img src={imgSrc} style={style} alt={faction} />
    </>
  );
};
