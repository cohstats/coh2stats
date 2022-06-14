import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Timeline, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
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

const ReplayAnalysis: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [replayData, setReplayData] = useState<any>(undefined);
  const [selectedPlayerId, setSelectedPlayerId] = useState(0);
  useEffect(() => {
    init().then(() => {
      setLoaded(true);
    });
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

  let commands = [];
  if (replayData) {
    commands = replayData.commands[selectedPlayerId].filter((command: any) => command.command_type !== "SCMD_Move" && command.command_type !== "SCMD_AttackMove" && command.command_type !== "SCMD_Capture" && command.command_type !== "SCMD_Retreat" && command.command_type !== "SCMD_Attack" && command.command_type !== "SCMD_ReinforceUnit");
  }

  return (<>
  <Row justify="center" style={{ padding: "10px"}}>
    <Col xs={22} xxl={14}>
      <input type="file" onChange={handleReplayUpload} />
      {replayData ? (<>
        {replayData.players.map((player: any) =>
          <Button key={player.id} onClick={() => handlePlayerSelect(player.id)}>{player.name}</Button>
        )}
        <Timeline>
          {commands.map((command: any, index: any) => (
            <Timeline.Item key={index}>{command.tick / 8} seconds command: {command.command_type} entity id: {command.entity_id} {command.command_type === "CMD_BuildSquad" && unitIds.hasOwnProperty(command.entity_id) ? unitIds[command.entity_id as any]: null}</Timeline.Item>
          ))}

        </Timeline>
      </>) : null}
    </Col>
  </Row>
  </>);
}

export default ReplayAnalysis;
