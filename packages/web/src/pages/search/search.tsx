import React, { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import Search from "antd/es/input/Search";
import { useHistory, useParams } from "react-router";
import routes from "../../routes";
import { Avatar, Empty, Row, Space } from "antd";

import "./search.css";
import { History } from "history";
import firebaseAnalytics from "../../analytics";
import { CountryFlag } from "../../components/country-flag";
import { AlertBox } from "../../components/alert-box";

type userAPIObject = Record<"steamProfile" | "relicProfile", Record<string, any>>;

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
      className={"player"}
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

const CustomSearch: React.FC = () => {
  const { push } = useHistory();

  // We should use normal query params and not / in the path
  const { searchParam } = useParams<{
    searchParam: string;
  }>();

  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<JSX.Element | undefined>(undefined);

  useEffect(() => {
    const buildSearchResults = (data: Record<string, any>): JSX.Element => {
      if (Object.entries(data).length === 0) {
        return (
          <div>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`No user profile with name ${searchParam} found`}
            />
          </div>
        );
      } else {
        const userCards = [];
        for (const value of Object.values(data)) {
          userCards.push(userCard(value, push));
        }

        return (
          <Space wrap size={10} style={{ maxWidth: 720 }}>
            {userCards}
          </Space>
        );
      }
    };

    (async () => {
      if (searchParam) {
        setIsLoading(true);

        firebaseAnalytics.searchUsed(searchParam);

        const payLoad = { name: searchParam };
        const searchPlayers = firebase.functions().httpsCallable("searchPlayers");

        try {
          const { data } = await searchPlayers(payLoad);
          const foundProfiles: Record<string, any> = data["foundProfiles"];
          const resultHtml = buildSearchResults(foundProfiles);

          setSearchData(resultHtml);
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
                If the error persists, please report it{" "}
                <a
                  href={"https://github.com/petrvecera/coh2ladders/issues"}
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
        placeholder="Steam name or steam id"
        defaultValue={searchParam}
        onSearch={onSearch}
        style={{ width: 320, padding: 20 }}
        loading={loading}
        enterButton
        allowClear
      />
      <div>{searchData}</div>
    </div>
  );
};

export default CustomSearch;
