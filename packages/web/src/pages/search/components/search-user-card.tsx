import React from "react";
import routes from "../../../routes";
import { Avatar } from "antd";
import { History } from "history";
import { CountryFlag } from "../../../components/country-flag";
import { userAPIObject } from "../types";

const SearchUserCard = (
  userObject: userAPIObject,
  push: {
    (path: string, state?: unknown): void;
    (location: History.LocationDescriptor<unknown>): void;
    (arg0: string): void;
  },
) => {
  const steamProfile = userObject.steamProfile;
  const relicProfile = userObject.relicProfile;

  const relicProfileMember = relicProfile["members"][0];
  const playerName = relicProfileMember["alias"];
  const countryCode = relicProfileMember["country"];
  const xp = relicProfileMember["xp"];

  const onProfileClick = (steamId: string) => {
    push(routes.playerCardWithId(steamId));
  };

  return (
    <div
      key={steamProfile?.["steamid"]}
      className={"player resultBox"}
      onClick={() => {
        onProfileClick(steamProfile?.["steamid"]);
      }}
    >
      <Avatar
        size={45}
        shape="square"
        src={steamProfile?.["avatarmedium"]}
        style={{ display: "inline-block", verticalAlign: "top" }}
      />
      <div style={{ display: "inline-block", paddingLeft: 5, width: 180, textAlign: "left" }}>
        <CountryFlag countryCode={countryCode} />
        <b>
          {playerName}
          <br />
          XP:
        </b>{" "}
        {xp.toLocaleString()}
      </div>
    </div>
  );
};

export default SearchUserCard;
