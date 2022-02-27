import Alert from "antd/lib/alert";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import message from "antd/lib/message";
import Select from "antd/lib/select";
import Switch from "antd/lib/switch";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StreamOverlayPositions } from "../../../redux/state";
import { actions, selectSettings } from "../../../redux/slice";
import { useEffect, useState } from "react";
import { events, firebaseInit } from "../../firebase/firebase";
import { Helper } from "@coh2ladders/shared/src/components/helper";
import { Tooltip, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import Spin from "antd/lib/spin";
import Title from "antd/lib/typography/Title";

const { Text } = Typography;

// Because about window is completely new render process we need to init firebase again
firebaseInit();

const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const [messageVisible, setMessageVisible] = useState(false);
  // Because reload after change of theme takes some time and UI becomes buggy, we want to display spin animation
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    events.settings();
  }, []);

  const savedMessage = () => {
    if (!messageVisible) {
      message.success("Saved automatically", 3, () => setMessageVisible(false));
      setMessageVisible(true);
    }
  };

  const handleUpdateIntervalChange = (value: number) => {
    dispatch(actions.setUpdateInterval(value));
    events.settings_changed("updateInterval");
    savedMessage();
  };

  const handleRunInTrayChange = (checked: boolean) => {
    dispatch(actions.setRunInTray(checked));
    events.settings_changed("runInTray");
    savedMessage();
  };

  const handleOpenInBrowserChange = (checked: boolean) => {
    dispatch(actions.setOpenLinksInBrowser(checked));
    events.settings_changed("openInBrowser");
    savedMessage();
  };

  const handleGameNotificationChange = (checked: boolean) => {
    dispatch(actions.setGameNotification(checked));
    events.settings_changed("setGameNotifications");
    savedMessage();
  };

  const handleStreamerModeChange = (checked: boolean) => {
    dispatch(actions.setStreamOverlay(checked));
    events.settings_changed("streamerMode");
    savedMessage();
  };

  const handleStreamModePortChange = (value: number) => {
    dispatch(actions.setStreamOverlayPort(value));
    events.settings_changed("streamerModePort");
    savedMessage();
  };

  const handleStreamViewLayoutChange = (value: StreamOverlayPositions) => {
    dispatch(actions.setStreamOverlayPosition(value));
    events.settings_changed("streamViewLayoutChange");
    savedMessage();
  };

  const handleThemeChange = (value: boolean) => {
    setReloading(true);
    dispatch(actions.setSettingsTheme(value ? "dark" : "light"));
    window.electron.ipcRenderer.reloadAllWindows();
  };

  const handleChangeOfPath = () => {
    window.electron.ipcRenderer.locateLogFile();
  };

  const handleScan = () => {
    window.electron.ipcRenderer.scanForLogFile();
  };

  if (reloading) {
    return (
      <div
        style={{
          textAlign: "center",
          top: "50%",
          left: "50%",
          position: "absolute",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
        <br />
        <Title>RELOADING</Title>
      </div>
    );
  }

  return (
    <>
      {!settings.coh2LogFileFound ? (
        <Alert
          type="error"
          message="Could not locate warnings.log file!"
          description="Either Company of Heroes 2 is not installed or your system configuration is different and you need to locate the warnings.log file manually"
          banner
        />
      ) : null}
      {settings.streamOverlay && !settings.streamOverlayPortFree ? (
        <Alert
          type="error"
          message="The port for the stream overlay is already in use!"
          description="Select a different port or make sure only one insantce of this application is running"
          banner
        />
      ) : null}
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        style={{ paddingTop: "20px", paddingBottom: "20px" }}
      >
        <Form.Item
          label={
            <>
              Path to warnings.log
              <Helper
                text={
                  <>
                    Path to COH warnings log. By default located in{" "}
                    <Text code>
                      "C:\\Users\\[user]\\Documents\\My Games\\Company of Heroes 2\\warnings.log"
                    </Text>
                  </>
                }
                style={{ paddingLeft: "5px" }}
              />
            </>
          }
        >
          <Input.Group compact>
            <Form.Item noStyle>
              <Input
                style={{ width: "70%" }}
                type={"text"}
                value={settings.coh2LogFileLocation}
                disabled
              />
            </Form.Item>
            <Form.Item noStyle>
              <Button onClick={handleChangeOfPath}>Select</Button>
            </Form.Item>
            <Form.Item noStyle>
              <Button onClick={handleScan}>Auto locate</Button>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          label={
            <>
              File check interval{" "}
              <Helper
                text={"Interval in seconds to check the warnings.log file for a new game."}
                style={{ paddingLeft: "5px" }}
              />
            </>
          }
        >
          <InputNumber
            min={1}
            addonAfter="Seconds"
            value={settings.updateInterval}
            onChange={handleUpdateIntervalChange}
          />
        </Form.Item>
        <Form.Item
          label={
            <>
              Run in tray{" "}
              <Helper
                text={"Application keeps running in system tray when all windows are closed."}
                style={{ paddingLeft: "5px" }}
              />
            </>
          }
        >
          <Switch checked={settings.runInTray} onChange={handleRunInTrayChange} />
        </Form.Item>
        <Form.Item
          label={
            <>
              Open detail info in browser{" "}
              <Helper
                text={
                  "Open player cards in your default system browser instead of a new application window."
                }
                style={{ paddingLeft: "5px" }}
              />
            </>
          }
        >
          <Switch checked={settings.openLinksInBrowser} onChange={handleOpenInBrowserChange} />
        </Form.Item>
        <Form.Item
          label={
            <>
              Notify when game found{" "}
              <Tooltip
                title={
                  'Windows will suppress notifications when focus assist do not disturb for games is enabled. To change that go to windows settings, search for focus assist and disable "When i\'m playing a game"'
                }
              >
                <ExclamationCircleOutlined style={{ color: "#eb2f96", paddingLeft: "5px" }} />
              </Tooltip>
            </>
          }
        >
          <Switch checked={settings.gameNotification} onChange={handleGameNotificationChange} />
        </Form.Item>
        <Form.Item label={<>Theme</>}>
          <Switch
            checkedChildren={"Dark"}
            unCheckedChildren={"Light"}
            checked={settings.theme === "dark"}
            onChange={handleThemeChange}
          />
        </Form.Item>
        <Form.Item
          label={
            <>
              Use streamer mode{" "}
              <Helper
                text={
                  <>
                    Learn more about the setup{" "}
                    <Typography.Link
                      onClick={() =>
                        window.electron.ipcRenderer.openInBrowser(
                          "https://github.com/petrvecera/coh2ladders/blob/master/packages/app/README.md#stream-overlay",
                        )
                      }
                    >
                      here
                    </Typography.Link>
                  </>
                }
                style={{ paddingLeft: "5px" }}
              />
            </>
          }
        >
          <Switch checked={settings.streamOverlay} onChange={handleStreamerModeChange} />
        </Form.Item>
        {settings.streamOverlay ? (
          <>
            <Form.Item label={"Streamer view server port"}>
              <InputNumber
                min={0}
                max={65535}
                value={settings.streamOverlayPort}
                formatter={(value) => Math.round(value) + ""}
                parser={(value) => Number.parseInt(value, 10)}
                onChange={handleStreamModePortChange}
              />
              <br />
              {" => URL: http://localhost:" + settings.streamOverlayPort}
            </Form.Item>
            <Form.Item label={"Streamer view layout"}>
              <Select
                value={settings.streamOverlayPosition}
                onChange={handleStreamViewLayoutChange}
              >
                <Select.Option value="top">Top</Select.Option>
                <Select.Option value="left">Left</Select.Option>
              </Select>
            </Form.Item>
          </>
        ) : null}
      </Form>
    </>
  );
};

export default App;
