import React, { useEffect, useState } from "react";
import { Badge, Tooltip } from "antd";
import config from "../config";

const onlineGamePlayersOnSteamUrl = `https://steam.coh3stats.com//ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${config.coh2steamGameId}`;

const OnlinePlayers: React.FC = () => {
  const [onlinePlayersData, setOnlinePlayersData] = useState<null | {
    playerCount: number;
    timeStampMs: number;
  }>(null);

  useEffect(() => {
    (async () => {
      try {
        if (
          (onlinePlayersData &&
            onlinePlayersData.timeStampMs < new Date().getTime() - 1000 * 60 * 4) ||
          !onlinePlayersData
        ) {
          const fetchData = await fetch(onlineGamePlayersOnSteamUrl);
          // reader header last-modified:
          const data = await fetchData.json();
          setOnlinePlayersData({
            playerCount: data.response.player_count,
            timeStampMs: new Date(fetchData.headers.get("last-modified") || "").getTime(),
          });
        }

        // Update the data every 5 minutes
        const intervalId = setInterval(async () => {
          try {
            if (
              (onlinePlayersData &&
                onlinePlayersData.timeStampMs < new Date().getTime() - 1000 * 60 * 4) ||
              !onlinePlayersData
            ) {
              const fetchData = await fetch(onlineGamePlayersOnSteamUrl);
              const data = await fetchData.json();
              if (data && data.player_count > 0) {
                setOnlinePlayersData({
                  playerCount: data.response.player_count,
                  timeStampMs: new Date(fetchData.headers.get("last-modified") || "").getTime(),
                });
              }
            }
          } catch (e) {
            console.error(e);
          }
        }, 1000 * 60 * 5);

        return () => {
          clearInterval(intervalId);
        };
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {onlinePlayersData && (
        <Tooltip
          title={`Amount of online Steam players in game Company of Heroes 2 as of  ${new Date(
            onlinePlayersData?.timeStampMs || "",
          ).toLocaleString()}`}
        >
          <span
            style={{
              color: "#f0f2f5",
            }}
          >
            Ingame players
          </span>

          <Badge
            className="site-badge-count-109"
            count={onlinePlayersData?.playerCount}
            style={{ backgroundColor: "#52c41a", boxShadow: "0 0 0 0", marginLeft: 10 }}
            overflowCount={99999}
          />
        </Tooltip>
      )}
    </>
  );
};

export default OnlinePlayers;
