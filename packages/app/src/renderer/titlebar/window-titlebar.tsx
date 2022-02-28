import { Col, Row } from "antd";
import React from "react";
import "./window-titlebar.css";
import icon from "../../../assets/icon.ico";
import { ApplicationWindows } from "../../redux/state";

interface Props {
  windowName: ApplicationWindows;
  invisibleBar?: boolean;
  cantMaximize?: boolean;
  items?: React.ReactNode;
}

const WindowTitlebar: React.FC<Props> = (props) => {
  return (
    <div style={{ display: "flex", flexFlow: "column", height: "100vh" }}>
      <div style={{ flex: "0 1 auto" }}>
        <div
          className={props.invisibleBar ? undefined : "ant-menu ant-menu-dark"}
          style={{ lineHeight: "unset", height: 30 }}
        >
          <Row>
            {!props.invisibleBar ? (
              <>
                <Col flex="none" className="windowIconArea">
                  <img
                    src={icon}
                    style={{
                      width: 24,
                      marginBottom: 4,
                      marginLeft: 10,
                      marginRight: 5,
                      marginTop: 2,
                    }}
                    alt="App Icon"
                  />
                </Col>
                {props.items}
              </>
            ) : null}
            <Col flex="auto" className="dragableTitlebar"></Col>
            <Col flex="none" className="windowControlsParent">
              <div
                className="windowControl"
                onClick={() => window.electron.ipcRenderer.minimizeWindow(props.windowName)}
              >
                ─
              </div>
              {!props.cantMaximize ? (
                <>
                  <div
                    className="windowControl"
                    onClick={() => window.electron.ipcRenderer.maximizeWindow(props.windowName)}
                  >
                    ☐
                  </div>
                </>
              ) : null}
              <div
                className="windowControl windowCloseControl"
                onClick={() => window.electron.ipcRenderer.closeWindow(props.windowName)}
              >
                X
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div style={{ flex: "1 1 auto", overflowY: "auto" }}>{props.children}</div>
    </div>
  );
};

export default WindowTitlebar;

/*
        <Menu theme="dark" className="dragableTitlebar" mode="horizontal">
          <Menu.Item style={{paddingLeft: 10}}><img src={icon} style={{ width: 24, paddingBottom: 3 }} alt="App Icon" /></Menu.Item>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Item>About</Menu.Item>
          <SubMenu key="SubMenu" title="Navigation Three - Submenu">
            <Menu.ItemGroup title="Item 1">
              <Menu.Item key="setting:1">Option 1</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Item 2">
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          {props.items}
        </Menu>
*/
