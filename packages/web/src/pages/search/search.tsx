import React, { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import Search from "antd/es/input/Search";
import { useHistory, useParams } from "react-router";
import routes from "../../routes";
import { Avatar, Divider, Empty, Row, Space } from "antd";

import "./search.css";
import { History } from "history";
import firebaseAnalytics from "../../analytics";
import { CountryFlag } from "../../components/country-flag";
import { AlertBox } from "../../components/alert-box";
import { httpsCallable } from "firebase/functions";
import { searchCommanders } from "../../coh/commanders";
import { searchBulletins } from "../../coh/bulletins";
import SearchCommanderCard from "./components/search-commander-card";
import SearchBulletinCard from "./components/search-bulletin-card";

type RelicProfileType = {
  id: number;
  members: Array<{
    alias: string;
    country: string;
    leaderboardregion_id: number;
    level: number;
    name: string;
    personal_statgroup_id: number;
    profile_id: number;
    xp: number;
  }>;
  name: string;
  type: number;
};

type SteamProfileType = {
  avatar: string;
  avatarfull: string;
  avatarhash: string;
  avatarmedium: string;
  communityvisibilitystate: number;
  personaname: string;
  personastate: number;
  personastateflags: number;
  primaryclanid: string;
  profilestate: number;
  profileurl: string;
  steamid: string;
  timecreated: number;
};

type userAPIObject = {
  steamProfile: SteamProfileType;
  relicProfile: RelicProfileType;
};

const userCard = (
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
      key={steamProfile["steamid"]}
      className={"player resultBox"}
      onClick={() => {
        onProfileClick(steamProfile["steamid"]);
      }}
    >
      <Avatar
        size={45}
        shape="square"
        src={steamProfile["avatarmedium"]}
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

const sortByXP = (array: Array<userAPIObject>) => {
  return array.sort((a, b) => {
    if (a.relicProfile.members[0].xp > b.relicProfile.members[0].xp) {
      return -1;
    } else {
      return 1;
    }
  });
};

const CustomSearch: React.FC = () => {
  const { push } = useHistory();

  // We should use normal query params and not / in the path
  const { searchParam } = useParams<{
    searchParam: string;
  }>();

  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<JSX.Element | undefined>(undefined);
  const [searchDataCommanders, setSearchDataCommanders] = useState<JSX.Element | undefined>(
    undefined,
  );
  const [searchIntelBulletin, setSearchIntelBulletin] = useState<JSX.Element | undefined>(
    undefined,
  );

  useEffect(() => {
    const buildSearchResults = (data: Record<string, any>): JSX.Element => {
      if (Object.entries(data).length === 0) {
        return (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={`No user profile with name ${searchParam} found`}
          />
        );
      } else {
        const userCards = [];
        const foundProfiles = Object.values(data);
        for (const value of sortByXP(foundProfiles)) {
          userCards.push(userCard(value, push));
        }

        return (
          <Space wrap size={10} style={{ maxWidth: 720 }} align={"center"}>
            {userCards}
          </Space>
        );
      }
    };

    const buildBulletinSearchResults = (data: Record<string, any>): JSX.Element => {
      if (Object.entries(data).length === 0) {
        return (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={`No intel bulletins with text ${searchParam} found`}
          />
        );
      } else {
        const bulletinCards = [];
        const foundBulletins = Object.values(data);
        for (const value of foundBulletins) {
          bulletinCards.push(<SearchBulletinCard bulletinData={value} />);
        }

        return (
          <Space wrap size={10} style={{ maxWidth: 540 }} align={"center"}>
            {bulletinCards}
          </Space>
        );
      }
    };

    const buildCommandersSearchResults = (data: Record<string, any>): JSX.Element => {
      if (Object.entries(data).length === 0) {
        return (
          <div>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`No Commanders with name ${searchParam} found`}
            />
          </div>
        );
      } else {
        const commanders = [];
        const foundCommanders = Object.values(data);
        for (const value of foundCommanders) {
          commanders.push(
            <SearchCommanderCard
              serverID={value.serverID}
              iconSmall={value.iconSmall}
              commanderName={value.commanderName}
              description={value.description}
              races={value.races}
            />,
          );
        }
        return (
          <Space wrap size={10} style={{ maxWidth: 540 }} align={"center"}>
            {commanders}
          </Space>
        );
      }
    };

    (async () => {
      if (searchParam) {
        setIsLoading(true);

        firebaseAnalytics.searchUsed(searchParam);

        const payLoad = { name: searchParam };

        const searchPlayers = httpsCallable(firebase.functions(), "searchPlayers");

        try {
          const { data } = await searchPlayers(payLoad);
          // @ts-ignore
          const foundProfiles: Record<string, any> = data["foundProfiles"];
          const resultHtml = buildSearchResults(foundProfiles);

          // Search Intel Bulletins from defined Function
          let bulletinData = searchBulletins(searchParam);
          // Parse Data into html
          const resultBulletinHtml = buildBulletinSearchResults(bulletinData);

          // Search Commanders from defined function
          let commanderData = searchCommanders(searchParam);
          // Parse Data into html
          const resultCommanderHtml = buildCommandersSearchResults(commanderData);

          setSearchData(resultHtml);
          setSearchIntelBulletin(resultBulletinHtml);
          setSearchDataCommanders(resultCommanderHtml);
        } catch (e: any) {
          console.error(e);
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [searchParam, push]);

  const onSearch = async (value: string) => {
    push(routes.searchWithParam(value));
  };

  if (error) {
    return (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <div style={{ display: "inline-block" }}>
          <AlertBox
            type={"error"}
            message={"There was an error while searching for players"}
            description={`${JSON.stringify(error)}`}
          />
          <AlertBox
            type={"warning"}
            message={"Relic API might not be responding"}
            description={
              <div>
                You can check Relic API status{" "}
                <a
                  href="https://stats.uptimerobot.com/03lN1ckr5j"
                  target="_blank"
                  rel={"noreferrer"}
                >
                  here
                </a>
                . If the error persists, please report it{" "}
                <a
                  href={"https://github.com/cohstats/coh2stats/issues"}
                  target={"_blank"}
                  rel="noreferrer"
                >
                  here.
                </a>
              </div>
            }
          />
        </div>
      </Row>
    );
  }

  return (
    <div style={{ textAlign: "center", maxWidth: 900, margin: "auto", paddingBottom: 20 }}>
      <Search
        placeholder="Steam name, steam id, commander, bulletin"
        defaultValue={searchParam}
        onSearch={onSearch}
        style={{ width: 320, padding: 20 }}
        loading={loading}
        enterButton
        allowClear
      />
      {!loading && searchParam && (
        <>
          <Divider type="horizontal" plain>
            Players
          </Divider>
          <div>{searchData}</div>
          <Divider type="horizontal" plain>
            Commanders
          </Divider>
          <div>{searchDataCommanders}</div>
          <Divider type="horizontal" plain>
            Intel Bulletins
          </Divider>
          <div>{searchIntelBulletin}</div>
        </>
      )}
    </div>
  );
};

export default CustomSearch;
