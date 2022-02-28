import React from "react";
import { Col } from "antd";
import "./window-titlebar-item.css";

interface Props {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const WindowTitlebarItem: React.FC<Props> = (props) => {
  return (
    <>
      <Col flex="none" className="windowMenuItem" onClick={props.onClick}>
        {props.children}
      </Col>
    </>
  );
};

export default WindowTitlebarItem;
