import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Timeline, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
import init, {parseReplay} from "@coh2stats/replay";

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
            <Timeline.Item key={index}>{command.tick / 8} seconds command: {command.command_type} entity id: {command.entity_id}</Timeline.Item>
          ))}

        </Timeline>
      </>) : null}
    </Col>
  </Row>
  </>);
}

export default ReplayAnalysis;
