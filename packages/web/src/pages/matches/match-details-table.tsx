import React from "react";
import { ColumnsType } from "antd/lib/table";
import { getGeneralIconPath } from "../../coh/helpers";
import { raceIds } from "./table-functions";
import { Table, Tooltip } from "antd";
import { Helper } from "../../components/helper";

interface MatchPlayerDetailsTableProps {
  data: Array<Record<string, any>>;
  smallView?: boolean;
}

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
            <Tooltip title={profile.alias}>{profile.alias}</Tooltip>
          </div>
        );
      },
    },
    {
      title: "Damage Dealt",
      dataIndex: "dmgdone",
      key: "dmgdone",
      align: "center" as "center",
      render: (dmgdone: number) => {
        return dmgdone.toLocaleString();
      },
    },
    {
      title: "Units Killed",
      dataIndex: "ekills",
      key: "ekills",
      align: "center" as "center",
    },
    {
      title: "Units Lost",
      dataIndex: "edeaths",
      key: "edeaths",
      align: "center" as "center",
    },
    {
      title: "K/D",
      key: "kd",
      align: "center" as "center",
      render: (record) => {
        return (record.ekills / record.edeaths).toFixed(2);
      },
    },
    {
      title: "Squads Killed",
      dataIndex: "sqkilled",
      key: "sqkilled",
      align: "center" as "center",
    },
    {
      title: "Squads Made / Lost",
      dataIndex: "sqprod",
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
    },
    {
      title: "Vehicles Prod / Lost",
      dataIndex: "vprod",
      key: "vprod",
      align: "center" as "center",
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
    },
    {
      title: "Commander Abilities used",
      dataIndex: "cabil",
      key: "cabil",
      align: "center" as "center",
    },
    // {
    //   title: "Squads Lost",
    //   dataIndex: "sqlost",
    //   key: "sqlost",
    //   align: "center" as "center",
    // },
    // {
    //   title: "K/D Ration",
    //   dataIndex: "sqlost",
    //   key: "kdration",
    //   align: "center" as "center",
    //   render: (_, record: Record<string, any>) => {
    //     return (record.sqkilled / record.sqprod).toFixed(2)
    //   }
    // },
    {
      title: (
        <>
          <img src={getGeneralIconPath("mp")} height="20px" alt={"Man power"} /> Spent / Max Float
        </>
      ),
      dataIndex: "manmax",
      key: "manmax",
      align: "center" as "center",
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

  return (
    <>
      <Table
        style={{ margin: "0 !important" }}
        bordered={false}
        pagination={false}
        columns={finalColumns}
        dataSource={convertedData}
        rowKey={(record) => record.id}
        size="small"
      />
    </>
  );
};
