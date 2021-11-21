import React from "react";
import { Card, Row, Space } from "antd";
import { useMediaQuery } from "react-responsive";
import { FactionsPlayedPieChart } from "./general-charts/factions-pie";
import { StatsDataObject } from "../../coh/types";
import { TypeOfGamesPieChart } from "./general-charts/types-games-pie";
import { Helper } from "../../components/helper";
import { FactionsBarStackedChart } from "./general-charts/factions-bar-stacked";
import { TotalFactionWinRateChart } from "./general-charts/winRate-bar";
import { AverageGameTimeBarChart } from "./general-charts/average-gametime-bar";
import { TotalTimePieChart } from "./general-charts/total-time-pie";
import { FactionWinRateStackedChart } from "./general-charts/winRate-bar-stacked";

interface IProps {
  data: StatsDataObject;
}

const GeneralStats: React.FC<IProps> = ({ data }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  const RegularStatsCards = (props: {
    title:
      | boolean
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined;
    children:
      | boolean
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined;
  }) => {
    return (
      <Card
        title={props.title}
        bodyStyle={
          isMobile
            ? { width: "90vw", maxWidth: 480, height: 300 }
            : { width: "48vw", maxWidth: 480, height: 410 }
        }
      >
        {props.children}
      </Card>
    );
  };

  return (
    <>
      <Row justify={"center"} style={{ paddingTop: 10 }}>
        <Space
          size={"large"}
          wrap
          style={{ display: "flex", maxWidth: 1800, justifyContent: "center" }}
        >
          <RegularStatsCards
            title={
              <span>
                {`Amount of games analyzed `}
                <Helper
                  text={
                    "We are unable to track all the games which are played. See about page to understand which" +
                    " games are tracked."
                  }
                />
              </span>
            }
          >
            <TypeOfGamesPieChart data={data} />
          </RegularStatsCards>
          <RegularStatsCards title={`Factions played across all game types`}>
            <FactionsPlayedPieChart data={data} />
          </RegularStatsCards>
          <RegularStatsCards title={`Popularity of factions across game types`}>
            <FactionsBarStackedChart data={data} />
          </RegularStatsCards>
          <RegularStatsCards title={"Winrate across all the game types"}>
            <TotalFactionWinRateChart data={data} />
          </RegularStatsCards>

          <RegularStatsCards title={`Faction winrates across game types`}>
            <FactionWinRateStackedChart data={data} />
          </RegularStatsCards>
          <RegularStatsCards title={"Average game time"}>
            <AverageGameTimeBarChart data={data} />
          </RegularStatsCards>
          <RegularStatsCards title={`Total hours spend in ranked games`}>
            <TotalTimePieChart data={data} />
          </RegularStatsCards>
        </Space>
      </Row>
    </>
  );
};

export default GeneralStats;
