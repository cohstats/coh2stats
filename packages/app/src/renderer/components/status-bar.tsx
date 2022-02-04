import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import React from "react";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
}

const StatusBar: React.FC<Props> = (props) => {
  return (
    <Row style={{ paddingTop: 10, paddingLeft: 20, paddingRight: 20 }}>
      <Col span={12}>{props.left}</Col>
      <Col span={12} style={{ textAlign: "right" }}>
        {props.right}
      </Col>
    </Row>
  );
};

export default StatusBar;
