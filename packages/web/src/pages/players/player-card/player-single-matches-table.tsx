import React from "react";
import { ColumnsType } from "antd/es/table";
import { PlayerCardDataArrayObject } from "../../../coh/types";
import { Table, Tooltip, Typography } from "antd";
import { getGeneralIconPath, levelToText } from "../../../coh/helpers";
import { Helper } from "../../../components/helper";
import { formatTimeAgo, latestDate, percentageFormat } from "./helpers";
import { HistoryOutlined } from "@ant-design/icons";
import { firebaseTimeStampObjectToDate } from "../../../utils/helpers";
import { PlayerGroupHistoryChart } from "./playergroup-history-chart";
const { Text } = Typography;

interface IProps {
  title: string;
  data: Array<PlayerCardDataArrayObject>;
}

const PlayerSingleMatchesTable: React.FC<IProps> = ({ title, data }) => {
  const isAIGame = title.startsWith("AI");

  const sortedData = data.sort((a, b) => {
    if (a.mode > b.mode) {
      return 1;
    } else {
      return -1;
    }
  });

  const TableColumns: ColumnsType<PlayerCardDataArrayObject> = [
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      align: "center" as "center",
      width: 70,
    },
    {
      title: "Rank",
      key: "rank",
      align: "center" as "center",
      width: 70,
      render: (data: PlayerCardDataArrayObject) => {
        if (data.rank < 0) {
          if (data.historic) {
            const historicRecords = data.historic.history;
            const lastKnownData = historicRecords[historicRecords.length - 1];

            return (
              <>
                <Tooltip
                  title={`Historic record from ${firebaseTimeStampObjectToDate(
                    lastKnownData.ts,
                  ).toLocaleString()}. Currently UNRANKED.`}
                >
                  <Text type="secondary">
                    {lastKnownData.r} <HistoryOutlined />
                  </Text>
                </Tooltip>
              </>
            );
          } else {
            return "-";
          }
        } else {
          return data.rank;
        }
      },
    },
    {
      title: (
        <>
          Level{" "}
          <Helper
            text={
              "Level 1 - 15 shows that you are better than bottom x% of players in the given leaderboard. Hover over the level to see the number." +
              " Level 16 - 20 are top 200 players."
            }
          />
        </>
      ),
      key: "ranklevel",
      align: "center" as "center",
      width: 90,
      render: (data: PlayerCardDataArrayObject) => {
        if (data.ranklevel <= 0) {
          if (data.historic) {
            const historicRecords = data.historic.history;
            const lastKnownData = historicRecords[historicRecords.length - 1];

            return (
              <>
                <Tooltip
                  title={`Historic record from ${firebaseTimeStampObjectToDate(
                    lastKnownData.ts,
                  ).toLocaleString()}. Currently UNRANKED.`}
                >
                  <Text type="secondary">
                    {lastKnownData.rl} <HistoryOutlined />
                  </Text>
                </Tooltip>
              </>
            );
          } else {
            return "-";
          }
        } else {
          return <Tooltip title={levelToText(data.ranklevel)}>{data.ranklevel}</Tooltip>;
        }
      },
    },
    {
      title: "Streak",
      dataIndex: "streak",
      key: "streak",
      align: "center" as "center",
      width: 90,
      render: (data: number) => {
        if (data > 0) {
          return <div style={{ color: "green" }}>+{data}</div>;
        } else {
          return <div style={{ color: "red" }}>{data}</div>;
        }
      },
    },
    {
      title: "Wins",
      dataIndex: "wins",
      key: "wins",
      align: "center" as "center",
      width: 90,
    },
    {
      title: "Losses",
      dataIndex: "losses",
      key: "losses",
      align: "center" as "center",
      width: 90,
    },
    {
      title: "Ratio",
      key: "ratio",
      align: "center" as "center",
      width: 90,
      render: (data: PlayerCardDataArrayObject) => {
        return <div>{percentageFormat(data.wins, data.losses)}%</div>;
      },
    },
    {
      title: "Total",
      key: "total",
      align: "center" as "center",
      width: 90,
      render: (data: any) => {
        return <>{data.wins + data.losses}</>;
      },
    },
    {
      title: "Drops",
      dataIndex: "drops",
      key: "drops",
      align: "center" as "center",
      width: 70,
    },
    {
      title: "Disputes",
      dataIndex: "disputes",
      key: "disputes",
      align: "center" as "center",
      width: 70,
    },
    {
      title: "Last Game",
      dataIndex: "lastmatchdate",
      key: "lastmatchdate",
      align: "right" as "right",
      width: 120,
      render: (data: any) => {
        if (data) {
          return (
            <Tooltip title={new Date(data * 1000).toLocaleString()}>
              {formatTimeAgo(data)}
            </Tooltip>
          );
        }
      },
    },
    Table.EXPAND_COLUMN,
  ];

  const tableTitle = (() => {
    if (isAIGame) {
      return title;
    } else {
      return title.toUpperCase();
    }
  })();

  const imageSource = (() => {
    if (isAIGame) {
      return getGeneralIconPath("Multiplayer_AICallout");
    } else if (title === "Custom Games") {
      return getGeneralIconPath("Multiplayer_Gears");
    } else {
      return getGeneralIconPath(title);
    }
  })();

  return (
    <div key={title}>
      <div style={{ fontSize: "large", paddingBottom: 4, paddingLeft: 4 }}>
        <img src={imageSource} height="24px" alt={title} /> <Text strong>{tableTitle}</Text>{" "}
      </div>
      <Table
        key={title}
        style={{ paddingBottom: 20, overflow: "auto" }}
        columns={TableColumns}
        rowKey={(record) => `${record?.leaderboard_id}-${record?.statgroup_id}`}
        dataSource={sortedData}
        pagination={false}
        size={"small"}
        expandable={{
          expandedRowRender: (record) => <PlayerGroupHistoryChart record={record} />,
          expandRowByClick: true,
        }}
        summary={(pageData) => {
          let totalWins = 0;
          let totalLosses = 0;
          let totalDrops = 0;
          let totalDisputes = 0;

          pageData.forEach(({ wins, losses, drops, disputes }) => {
            totalWins += wins;
            totalLosses += losses;
            totalDrops += drops;
            totalDisputes += disputes;
          });

          const lastDate = latestDate(sortedData);

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={3} />
                <Table.Summary.Cell index={2}>{totalWins}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{totalLosses}</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {percentageFormat(totalWins, totalLosses)}%
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{totalWins + totalLosses}</Table.Summary.Cell>
                <Table.Summary.Cell index={6}>{totalDrops}</Table.Summary.Cell>
                <Table.Summary.Cell index={7}>{totalDisputes}</Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <Tooltip title={`Last game as ${title.toUpperCase()}`}>
                    {lastDate !== 0 && formatTimeAgo(lastDate)}
                  </Tooltip>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </div>
  );
};

export default PlayerSingleMatchesTable;
