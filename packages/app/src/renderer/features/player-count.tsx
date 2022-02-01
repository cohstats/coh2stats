import Badge from "antd/lib/badge";
import Spin from "antd/lib/spin";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";

const PlayerCount: React.FC = () => {
  const [onlinePlayers, setOnlinePlayers] = useState<number | null>(null);

  // listen to player count from firesore
  useEffect(() => {
    onSnapshot(doc(getFirestore(), "stats", "onlinePlayers"), (doc) => {
      setOnlinePlayers(doc.data().onlinePlayers);
    });
  }, []);

  return (
    <>
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
    </>
  );
};

export default PlayerCount;
