import React, { useEffect, useState } from "react";
import Tooltip from "antd/es/tooltip";
import { capitalize, convertTeamNames, findPlayerProfile, timeAgo } from "../utils/helpers";
import config from "@coh2stats/web/src/config";
import { calculateOverallStatsForPlayerCard } from "@coh2stats/web/src/pages/players/data-processing";
import Typography from "antd/es/typography";
import { Loading } from "./loading";
import { Col, Row } from "antd/es";

type playerCardAPIObject = {
  relicPersonalStats: Record<string, any>;
  steamProfile: Record<string, any>;
  playerMatches: Array<Record<string, any>>;
  playTime: null | number;
};

const { Text } = Typography;

interface Props {
  record: { members: { steamID: string }[] };
}

const ExtraPLayerInfo: React.FC<Props> = ({ record }) => {
  const steamid = record?.members[0]?.steamID;

  const [isLoading, setIsLoading] = useState(true);
  const [calculatedResult, setCalculatedResult] = useState<any>();
  const [allData, setAllData] = useState<playerCardAPIObject | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (steamid) {
        try {
          const response = await fetch(
            `https://${config.firebaseFunctions.location}-coh2-ladders-prod.cloudfunctions.net/getPlayerCardEverythingHttp?steamid=${steamid}&includeMatches=false`,
          );
          const finalData: playerCardAPIObject = await response.json();
          const relicData = finalData.relicPersonalStats;
          setAllData(finalData);
          // const { calculatedResult.totalGames, lastGameDate, calculatedResult.bestRank, calculatedResult.mostPlayed, totalWinRate } =
          setCalculatedResult(calculateOverallStatsForPlayerCard(relicData.leaderboardStats));
        } catch (e) {
          setError(e);
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [steamid]);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (error) {
    return <>{JSON.stringify(error)}</>;
  } else {
    const playerRelicProfile = findPlayerProfile(allData.relicPersonalStats.statGroups);

    return (
      <Row>
        <Col span={12}>
          <div style={{ float: "right", textAlign: "right", paddingRight: 20 }}>
            <Text strong>{calculatedResult.totalGames} ranked games</Text>
            <div />
            <div>
              <Text strong>
                {(calculatedResult.totalWinRate * 100).toFixed(0)}% ranked winrate
              </Text>
            </div>
            <div>
              <b>XP:</b> {playerRelicProfile.xp.toLocaleString()}
              {playerRelicProfile.xp === 18785964 ? " (MAX)" : ""}
              <br />
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ paddingLeft: 20 }}>
            <div>
              {calculatedResult.bestRank.rank !== Infinity ? (
                <>
                  Current best rank <Text strong>{calculatedResult.bestRank.rank}</Text> in{" "}
                  <Text strong>
                    {convertTeamNames(calculatedResult.bestRank.mode)} as{" "}
                    {capitalize(calculatedResult.bestRank.race)}
                  </Text>
                </>
              ) : (
                <>
                  Currently <Text strong>unranked</Text>
                </>
              )}
            </div>
            <div>
              Most played{" "}
              <Text strong>
                {convertTeamNames(calculatedResult.mostPlayed.mode)} as{" "}
                {capitalize(calculatedResult.mostPlayed.race)}
              </Text>
            </div>
            <div>
              <Tooltip title={new Date(calculatedResult.lastGameDate * 1000).toLocaleString()}>
                Last match{" "}
                {timeAgo.format(
                  Date.now() - (Date.now() - calculatedResult.lastGameDate * 1000),
                  "round-minute",
                )}
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
};

export default ExtraPLayerInfo;
