import { isTimeStampInPatches } from "../coh/patches";
import { formatDate } from "../utils/helpers";
import { Col, Row, Typography } from "antd";
import React from "react";

const { Text, Link } = Typography;

interface IProps {
  params: {
    unixTimeStamp: string | number;
    unixTimeStampFrom: string | number;
    unixTimeStampTo: string | number;
  };
}

const PatchNotification: React.FC<IProps> = ({ params }) => {
  const { unixTimeStamp, unixTimeStampFrom, unixTimeStampTo } = params;

  const patches = unixTimeStamp ? isTimeStampInPatches(parseInt(`${unixTimeStamp}`)) : [];
  const patchesFrom = unixTimeStampFrom
    ? isTimeStampInPatches(parseInt(`${unixTimeStampFrom}`))
    : [];
  const patchesTo = unixTimeStampTo ? isTimeStampInPatches(parseInt(`${unixTimeStampTo}`)) : [];

  // Clear duplicates by going Array -> Set -> Array
  const allPatches = [...new Set(patches.concat(patchesFrom).concat(patchesTo))];

  const patchesJSX = [];

  let i = 0;
  for (const patch of allPatches) {
    const endTimeStamps = patch.endDateUnixTimeStamp * 1000;
    const endDate = endTimeStamps === Infinity ? "Now" : formatDate(new Date(endTimeStamps));
    const startDate = formatDate(new Date(patch.startDateUnixTimeStamp * 1000));

    patchesJSX.push(
      <Row key={i++}>
        <Col span={12} style={{ textAlign: "right" }}>
          <Link href={patch.link} target="_blank">
            <Text strong>{patch.name}</Text>
          </Link>
        </Col>
        <Col>
          &nbsp;- From {startDate} to {endDate}
        </Col>
      </Row>,
    );
  }

  return <div style={{ textAlign: "center" }}>{patchesJSX}</div>;
};

export default PatchNotification;
