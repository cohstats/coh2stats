import React, { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { useRouter, useParams } from "next/navigation";
import routes from "../../routes";
import { Divider, Empty, Row, Space } from "antd";

import "./search.module.css";
import firebaseAnalytics from "../../analytics";
import { AlertBox } from "../alert-box";
import { searchCommanders } from "../../coh/commanders";
import { searchBulletins } from "../../coh/bulletins";
import SearchCommanderCard from "./search-commander-card";
import SearchBulletinCard from "./search-bulletin-card";
import { userAPIObject } from "./types";
import SearchUserCard from "./search-user-card";
import { Tip } from "../tip";
import { searchPlayersAction } from "../../app/search/actions";

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
  const router = useRouter();

  // We should use normal query params and not / in the path
  const params = useParams();
  const searchParam = params?.searchParam as string | undefined;

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
          userCards.push(SearchUserCard(value, router.push));
        }

        return (
          <div>
            <Space wrap size={10} style={{ maxWidth: 720 }} align={"center"}>
              {userCards}
            </Space>
            {userCards.length > 50 && (
              <div style={{ paddingTop: 15 }}>
                <Tip
                  text={
                    <>
                      Advanced search (not exact name) is limited to 50 results only. Try adding
                      more characters.
                    </>
                  }
                />
              </div>
            )}
          </div>
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
          bulletinCards.push(<SearchBulletinCard bulletinData={value} key={value.serverID} />);
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
              key={value.serverID}
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

        try {
          const response = await searchPlayersAction(searchParam);

          if (!response) {
            throw new Error("Failed to search for players");
          }

          // @ts-ignore
          const foundProfiles: Record<string, any> = response.result["foundProfiles"];
          const resultHtml = buildSearchResults(foundProfiles);

          // Search Intel Bulletins from defined Function
          const bulletinData = searchBulletins(searchParam);
          // Parse Data into html
          const resultBulletinHtml = buildBulletinSearchResults(bulletinData);

          // Search Commanders from defined function
          const commanderData = searchCommanders(searchParam);
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
  }, [searchParam, router]);

  const onSearch = async (value: string) => {
    router.push(routes.searchWithParam(value));
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
          <Divider orientation="horizontal" plain>
            Players
          </Divider>
          <div>{searchData}</div>
          <Divider orientation="horizontal" plain>
            Commanders
          </Divider>
          <div>{searchDataCommanders}</div>
          <Divider orientation="horizontal" plain>
            Intel Bulletins
          </Divider>
          <div>{searchIntelBulletin}</div>
        </>
      )}
    </div>
  );
};

export default CustomSearch;
