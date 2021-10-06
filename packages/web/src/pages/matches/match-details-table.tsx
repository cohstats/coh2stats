import React from "react";
import { ColumnsType } from "antd/lib/table";
import { convertSteamNameToID, getGeneralIconPath } from "../../coh/helpers";
import { raceIds } from "./table-functions";
import { Table, Tooltip } from "antd";
import { Helper } from "../../components/helper";
import { Link } from "react-router-dom";
import routes from "../../routes";

interface MatchPlayerDetailsTableProps {
  data: Array<Record<string, any>>;
  smallView?: boolean;
}

// Handle sorting with 2 directions only -> this is default sorting for a table
const simpleSorting: any = ["up", "down"];
const SimpleSortNumeric = (a: any, b: any, order?: string | null) => {
  switch (order) {
    case "up":
      return a - b;
    case "down":
      return b - a;
    default:
      return 0;
  }
};

// handle advanced sorting with lost/produced type of information
const advancedSorting: any = ["up1", "down1", "up2", "down2"];
const AdvancedSortNumeric = (a1: any, b1: any, a2: any, b2: any, order?: string | null) => {
  switch (order) {
    case "up1":
      return a1 - b1;
    case "down1":
      return b1 - a1;
    case "up2":
      return a2 - b2;
    case "down2":
      return b2 - a2;
    default:
      return 0;
  }
};

export const MatchPlayerDetailsTable: React.FC<MatchPlayerDetailsTableProps> = ({
  data,
  smallView = false,
}) => {
  const convertedData = data.map((playerData) => {
    return {
      ...playerData,
      ...JSON.parse(playerData["counters"]),
    };
  });

  const smallViewOnlyIndexes = ["profile", "ekills", "gt", "dmgdone"];

  const columns: ColumnsType<Record<string, any>> = [
    {
      title: "Player",
      dataIndex: "profile",
      key: "profile",
      width: 150,
      align: "left" as "left",
      render: (profile: Record<string, any>, record: Record<string, any>) => {
        return (
          <div
            style={{
              width: 150,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <img
              key={record.profile_id}
              src={getGeneralIconPath(raceIds[record.race_id], "small")}
              height="20px"
              alt={record.race_id}
            />{" "}
            <Tooltip title={profile.alias}>
              <Link to={routes.playerCardWithId(convertSteamNameToID(profile["name"]))}>
                {profile["alias"]}
              </Link>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Damage Dealt",
      dataIndex: "dmgdone",
      key: "dmgdone",
      align: "center" as "center",
      sorter: (a, b, sortOrder) => SimpleSortNumeric(a.dmgdone, b.dmgdone, sortOrder),
      render: (dmgdone: number) => {
        return dmgdone.toLocaleString();
      },
    },
    {
      title: "Units Killed",
      dataIndex: "ekills",
      key: "ekills",
      align: "center" as "center",
      sorter: (a, b, sortOrder) => SimpleSortNumeric(a.ekills, b.ekills, sortOrder),
    },
    {
      title: "Units Lost",
      dataIndex: "edeaths",
      key: "edeaths",
      align: "center" as "center",
      sorter: (a, b, sortOrder) => SimpleSortNumeric(a.edeaths, b.edeaths, sortOrder),
    },
    {
      title: "K/D",
      key: "kd",
      align: "center" as "center",
      sorter: (a, b, sortOrder) =>
        SimpleSortNumeric(a.ekills / a.edeaths, b.ekills / b.edeaths, sortOrder),
      render: (record) => {
        return (record.ekills / record.edeaths).toFixed(2);
      },
    },
    {
      title: "Squads Killed",
      dataIndex: "sqkilled",
      key: "sqkilled",
      align: "center" as "center",
      sorter: (a, b, sortOrder) => SimpleSortNumeric(a.sqkilled, b.sqkilled, sortOrder),
    },
    {
      title: "Squads Made / Lost",
      dataIndex: "sqprod",
      sortDirections: advancedSorting,
      sorter: (a, b, sortOrder) =>
        AdvancedSortNumeric(a.sqprod, b.sqprod, a.sqlost, b.sqlost, sortOrder),
      key: "sqprod",
      align: "center" as "center",
      render: (sqprod: number, record: Record<string, any>) => {
        return (
          <>
            {sqprod} / {record.sqlost}
          </>
        );
      },
    },
    {
      title: "Vehicles Killed",
      dataIndex: "vkill",
      key: "vkill",
      align: "center" as "center",
      sorter: (a, b, sortOrder) => SimpleSortNumeric(a.vkill, b.vkill, sortOrder),
    },
    {
      title: "Vehicles Prod / Lost",
      dataIndex: "vprod",
      key: "vprod",
      align: "center" as "center",
      sortDirections: advancedSorting,
      sorter: (a, b, sortOrder) =>
        AdvancedSortNumeric(a.vprod, b.vprod, a.vlost, b.vlost, sortOrder),
      render: (vprod: number, record: Record<string, any>) => {
        return (
          <>
            {vprod} / {record.vlost}
          </>
        );
      },
    },
    {
      title: (
        <>
          Vehicles Captured / Abandoned{" "}
          <Helper
            text={"When USF units leave and enter their vehicle, it's counted as capture."}
          />
        </>
      ),
      dataIndex: "vcap",
      key: "vcap",
      align: "center" as "center",
      showSorterTooltip: false,
      sortDirections: advancedSorting,
      sorter: (a, b, sortOrder) =>
        AdvancedSortNumeric(a.vcap, b.vcap, a.vabnd, b.vabnd, sortOrder),
      render: (vcap: number, record: Record<string, any>) => {
        return (
          <>
            {vcap} / {record.vabnd}
          </>
        );
      },
    },
    {
      title: "Points Captured / Lost",
      dataIndex: "pcap",
      key: "pcap",
      align: "center" as "center",
      sortDirections: advancedSorting,
      sorter: (a, b, sortOrder) =>
        AdvancedSortNumeric(a.pcap, b.pcap, a.plost, b.plost, sortOrder),
      render: (pcap: number, record: Record<string, any>) => {
        return (
          <>
            {pcap} / {record.plost}
          </>
        );
      },
    },
    {
      title: (
        <>
          Points Recaptured{" "}
          <Helper text={"When player neutralizes point, it's counted as recapture."} />
        </>
      ),
      dataIndex: "precap",
      key: "precap",
      align: "center" as "center",
      showSorterTooltip: false,
      sorter: (a, b, sortOrder) => SimpleSortNumeric(a.precap, b.precap, sortOrder),
    },
    {
      title: "Commander Abilities used",
      dataIndex: "cabil",
      key: "cabil",
      align: "center" as "center",
      sorter: (a, b, sortOrder) => SimpleSortNumeric(a.cabil, b.cabil, sortOrder),
    },
    {
      title: (
        <>
          <img src={getGeneralIconPath("mp")} height="20px" alt={"Man power"} /> Spent / Max Float
        </>
      ),
      dataIndex: "manmax",
      key: "manmax",
      align: "center" as "center",
      sortDirections: advancedSorting,
      sorter: (a, b, sortOrder) =>
        AdvancedSortNumeric(
          Math.round((a.manspnt / (a.manearn + 400)) * 100),
          Math.round((b.manspnt / (b.manearn + 400)) * 100),
          a.manmax,
          b.manmax,
          sortOrder,
        ),
      render: (manmax, record: Record<string, any>) => {
        return (
          <>
            {Math.round((record.manspnt / (record.manearn + 400)) * 100)}% / {manmax}
          </>
        );
      },
    },
    {
      title: (
        <>
          <img src={getGeneralIconPath("fuel")} height="20px" alt={"fuel"} /> Spent / Max Float
        </>
      ),
      dataIndex: "fuelmax",
      key: "fuelmax",
      align: "center" as "center",
      sortDirections: advancedSorting,
      sorter: (a, b, sortOrder) =>
        AdvancedSortNumeric(a.fuelspnt, b.fuelspnt, a.fuelmax, b.fuelmax, sortOrder),
      render: (fuelmax, record: Record<string, any>) => {
        return (
          <>
            {Math.round((record.fuelspnt / (record.fuelearn + 20)) * 100)}% / {fuelmax}
          </>
        );
      },
    },
    {
      title: (
        <>
          <img src={getGeneralIconPath("mun")} height="20px" alt={"mun"} /> Spent / Max Float
        </>
      ),
      dataIndex: "munmax",
      key: "munmax",
      align: "center" as "center",
      sortDirections: advancedSorting,
      sorter: (a, b, sortOrder) =>
        AdvancedSortNumeric(a.munspnt, b.munspnt, a.munmax, b.munmax, sortOrder),
      render: (munmax, record: Record<string, any>) => {
        return (
          <>
            {Math.round((record.munspnt / record.munearn) * 100)}% / {munmax}
          </>
        );
      },
    },
    {
      title: (
        <>
          Game Time{" "}
          <Helper
            text={
              "If player left early and was replaced with AI, his time is different than other players."
            }
          />
        </>
      ),
      dataIndex: "gt",
      key: "gt",
      align: "center" as "center",
      showSorterTooltip: false,
      sorter: (a, b, sortOrder) => SimpleSortNumeric(a.gt, b.gt, sortOrder),
      render: (gt: number) => {
        return new Date(gt * 1000).toISOString().substr(11, 8);
      },
    },
  ];

  const finalColumns: ColumnsType<any> = smallView
    ? columns.filter((column) => {
        // @ts-ignore
        return smallViewOnlyIndexes.includes(column.dataIndex as string);
      })
    : columns;

  function showFactionResultColor(matchRecord: any, _smallView: boolean): string {
    if (!_smallView)
      if (matchRecord.resulttype === 1) return "green";
      else if (matchRecord.resulttype === 0) return "red";

    return "";
  }

  return (
    <>
      <Table
        style={{ margin: "0 !important" }}
        bordered={false}
        pagination={false}
        sortDirections={simpleSorting}
        columns={finalColumns}
        dataSource={convertedData}
        showSorterTooltip={{ title: "Click to cycle sorting modes" }}
        rowKey={(record) => record.id}
        rowClassName={(record) => showFactionResultColor(record, smallView)}
        size="small"
      />
    </>
  );
};
