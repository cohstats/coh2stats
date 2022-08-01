import Badge from "antd/es/badge";
import Spin from "antd/es/spin";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import { Tooltip } from "antd";

const PlayerCount: React.FC = () => {
  const [onlinePlayers, setOnlinePlayers] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<number>();

  // listen to player count from firesore
  useEffect(() => {
    onSnapshot(doc(getFirestore(), "stats", "onlinePlayers"), (doc) => {
      setOnlinePlayers(doc.data().onlinePlayers);
      setTimestamp(doc.data().timeStamp);
    });
  }, []);

  return (
    <>
      <Tooltip
        title={`Amount of online Steam players in game Company of Heroes 2 as of  ${new Date(
          timestamp * 1000,
        ).toLocaleString()}`}
      >
        <span>Ingame players</span>
        {onlinePlayers ? (
          <>
            <Badge
              style={{ backgroundColor: "#52c41a", marginLeft: 10 }}
              count={onlinePlayers}
              overflowCount={99999}
            />
          </>
        ) : (
          <>
            <Spin
              style={{ marginLeft: 10 }}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </>
        )}
      </Tooltip>
    </>
  );
};

export default PlayerCount;
