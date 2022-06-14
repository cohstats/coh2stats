import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Timeline, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useCallback, useEffect, useState } from "react";
import init, {parseReplay} from "@coh2stats/replay";

const unitIds: Record<number, string> = {
  12: "Grenadier",
  15: "MG 42",
  28: "Pioneer",
  30: "German Sniper",
  108: "Conscript",
  116: "Soviet Mortar",
  2631: "Riflemen",
  2664: "Volksgrenadier",
  17793: "Infantry Section"
}

const commanderIds: Record<number, string> = {
  6117: "German Mechanized Doctrine",
  5928: "Spearhead Doctrine"
}

const structureIds: Record<number, string> = {
  1473: "Infanterie Kompanie"
}

// https://docs.google.com/spreadsheets/d/1CvCwW41m8Qm7Tj3QNgE07ON6dU5hhsIROxzE4Fir7IQ/edit?usp=sharing
const spreadsheetURL = "https://docs.google.com/spreadsheets/d/1CvCwW41m8Qm7Tj3QNgE07ON6dU5hhsIROxzE4Fir7IQ/gviz/tq?"

const ReplayAnalysis: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [replayData, setReplayData] = useState<any>(undefined);
  const [selectedPlayerId, setSelectedPlayerId] = useState(0);
  const [pbgidMappings, setPbgidMappings] = useState<Record<number,string> | undefined>(undefined);
  const fetchMappings = () => {
    fetch(spreadsheetURL).then(res => res.text()).then(rawData => {
      const data = JSON.parse(rawData.substring(47).slice(0,-2));
      const newMappings: Record<number,string> = {};
      data.table.rows.forEach((row: any) => {
        // console.log(row.c[0].v, row.c[1].v);
        newMappings[row.c[0].v] = row.c[1].v;
      });
      setPbgidMappings(newMappings);
      // console.log(data);
      console.log(newMappings);
    });
  };
  useEffect(() => {
    init().then(() => {
      setLoaded(true);
    });
    fetchMappings();
  }, []);
  const handleReplayUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const {files} = e.target;
    if (files && files.length && loaded) {
      files[0].arrayBuffer().then((buffer) => {
        const replayData = parseReplay(new Uint8Array(buffer));
        console.log(replayData);
        setReplayData(replayData);
        setSelectedPlayerId(0);
      });
    }

  };

  const handlePlayerSelect = (id: number) => {
    setSelectedPlayerId(id);
  }

  const handleRefreshMappings = () => {
    fetchMappings();
  }

  let commands = [];
  if (replayData) {
    //PCMD_SetCommander, PCMD_ConstructStructure, SCMD_Ability, CMD_Upgrade are commands of future interest
    // for now only build commands
    commands = replayData.commands[selectedPlayerId].filter((command: any) => command.command_type === "CMD_BuildSquad").map((command: any) => {
      var date = new Date(0);
      date.setSeconds(command.tick / 8);
      let unitText = "Unknown PBGID " + command.entity_id;
      if (pbgidMappings && pbgidMappings.hasOwnProperty(command.entity_id)) {
        unitText = pbgidMappings[command.entity_id as any];
      }
      return {
        time: date.toISOString().substring(11).substring(0,8),
        unitText: unitText
      }
    });
  }

  return (<>
  <Row justify="center" style={{ padding: "10px"}}>
    <Col xs={22} xxl={14}>
      <input type="file" onChange={handleReplayUpload} />
      {replayData ? (<>
        {replayData.players.map((player: any) =>
          <Button key={player.id} onClick={() => handlePlayerSelect(player.id)}>{player.name}</Button>
        )}
        <Button onClick={handleRefreshMappings}>Refresh mappings</Button>
        <Timeline>
          {commands.map((command: any, index: any) => (
            <Timeline.Item key={index}>{command.time} build {command.unitText}</Timeline.Item>
          ))}

        </Timeline>
      </>) : null}
    </Col>
  </Row>
  </>);
}

export default ReplayAnalysis;
