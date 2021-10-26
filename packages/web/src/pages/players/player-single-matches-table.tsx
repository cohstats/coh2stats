import React from "react";
import { ColumnsType } from "antd/lib/table";
import { PlayerCardDataArrayObject } from "../../coh/types";
import { Table, Tooltip, Typography } from "antd";
import { timeAgo } from "../../utils/helpers";
import { getGeneralIconPath, levelToText } from "../../coh/helpers";
import { Helper } from "../../components/helper";
const { Text } = Typography;

interface IProps {
  title: string;
  data: Array<PlayerCardDataArrayObject>;
}

const PlayerSingleMatchesTable: React.FC<IProps> = ({ title, data }) => {
  const sortedData = data.sort((a, b) => {
    if (a.mode > b.mode) {
      return 1;
    } else {
      return -1;
    }
  });

  const percentageFormat = (wins: number, losses: number) => {
    return Math.round(100 * Number(wins / (losses + wins)));
  };

  const latestDate = () => {
    let latest = sortedData[0].lastmatchdate;
    sortedData.forEach((data) => {
      if (data.lastmatchdate > latest) {
        latest = data.lastmatchdate;
      }
    });
    return latest;
  };

  const formatTimeAgo = (date: any) => {
    return timeAgo.format(Date.now() - (Date.now() - date * 1000), "round-minute");
  };

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
      dataIndex: "rank",
      key: "rank",
      align: "center" as "center",
      width: 70,
      render: (data: number) => {
        if (data < 0) {
          return "-";
        } else {
          return data;
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
      dataIndex: "ranklevel",
      key: "ranklevel",
      align: "center" as "center",
      width: 90,
      render: (data: number) => {
        if (data <= 0) {
          return "-";
        } else {
          return <Tooltip title={levelToText(data)}>{data}</Tooltip>;
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
  ];

  return (
    <div key={title}>
      <div style={{ fontSize: "large", paddingBottom: 4, paddingLeft: 4 }}>
        <img src={getGeneralIconPath(title)} height="24px" alt={title} />{" "}
        <Text strong>{title.toUpperCase()}</Text>{" "}
      </div>
      <Table
        key={title}
        style={{ paddingBottom: 20, overflow: "auto" }}
        columns={TableColumns}
        rowKey={(record) => `${record?.leaderboard_id}-${record?.statgroup_id}`}
        dataSource={sortedData}
        pagination={false}
        size={"small"}
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

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{totalWins}</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{totalLosses}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {percentageFormat(totalWins, totalLosses)}%
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>{totalWins + totalLosses}</Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{totalDrops}</Table.Summary.Cell>
                <Table.Summary.Cell index={6}>{totalDisputes}</Table.Summary.Cell>
                <Table.Summary.Cell index={7}>{formatTimeAgo(latestDate())}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </div>
  );
};

export default PlayerSingleMatchesTable;
