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
import { Helper } from "@coh2stats/shared/src/components/helper";
import { Collapse, Divider, Result, Spin, Steps, Tooltip, Typography } from "antd";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import WindowTitlebar from "../../titlebar/window-titlebar";

const { Text } = Typography;

// Because about window is completely new render process we need to init firebase again
firebaseInit();

const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const [messageVisible, setMessageVisible] = useState(false);
  const [twitchEPassword, setTwitchEPassword] = useState("");

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
    //setReloading(true);
    dispatch(actions.setSettingsTheme(value ? "dark" : "light"));
    //window.electron.ipcRenderer.reloadAllWindows();
  };

  const handleChangeOfPath = () => {
    window.electron.ipcRenderer.locateLogFile();
  };

  const handleScan = () => {
    window.electron.ipcRenderer.scanForLogFile();
  };

  const handleTwitchExtensionModeChange = (checked: boolean) => {
    dispatch(actions.setTwitchExtension(checked));
    savedMessage();
  };

  const handleTwitchExtensionPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setTwitchEPassword(event.target.value);
  };

  return (
    <>
      <WindowTitlebar windowName="settings" cantMaximize>
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
          style={{ paddingBottom: "20px" }}
        >
          <Collapse defaultActiveKey={["1"]} accordion>
            <Collapse.Panel header="General" key="1">
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
                <Switch
                  checked={settings.openLinksInBrowser}
                  onChange={handleOpenInBrowserChange}
                />
              </Form.Item>
              <Form.Item
                label={
                  <>
                    Run in tray{" "}
                    <Helper
                      text={
                        "Application keeps running in system tray when all windows are closed."
                      }
                      style={{ paddingLeft: "5px" }}
                    />
                  </>
                }
              >
                <Switch checked={settings.runInTray} onChange={handleRunInTrayChange} />
              </Form.Item>
              <Divider orientation="left" plain>
                Log file checking
              </Divider>
              <Form.Item
                label={
                  <>
                    Path to warnings.log
                    <Helper
                      text={
                        <>
                          Path to COH warnings log. By default located in{" "}
                          <Text code style={{ color: "white" }}>
                            "C:\Users\[user]\Documents\My Games\Company of Heroes 2\warnings.log"
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
                      readOnly
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
              <Divider orientation="left" plain>
                <Text type="danger">Experimental</Text>
              </Divider>
              <Form.Item
                label={
                  <>
                    Notify when game found{" "}
                    <Tooltip
                      title={
                        'Windows will suppress notifications when focus assist do not disturb for games is enabled. To change that go to windows settings, search for focus assist and disable "When i\'m playing a game"'
                      }
                    >
                      <ExclamationCircleOutlined
                        style={{ color: "#eb2f96", paddingLeft: "5px" }}
                      />
                    </Tooltip>
                  </>
                }
              >
                <Switch
                  checked={settings.gameNotification}
                  onChange={handleGameNotificationChange}
                />
              </Form.Item>
            </Collapse.Panel>
            <Collapse.Panel
              collapsible="header"
              header={
                <>
                  Twitch Extension{" "}
                  <Helper
                    text={
                      <>
                        Use our twitch extension to display interactive stats for your viewers on
                        stream. Get the extension{" "}
                        <Typography.Link
                          onClick={() =>
                            window.electron.ipcRenderer.openInBrowser(
                              "https://github.com/cohstats/coh2stats/blob/master/packages/app/README.md",
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
              extra={
                <Switch
                  checked={settings.twitchExtension}
                  onChange={handleTwitchExtensionModeChange}
                  checkedChildren={"enabled"}
                  unCheckedChildren={"disabled"}
                />
              }
              key="2"
            >
              {settings.twitchExtension ? null : (
                <Alert
                  style={{ marginBottom: 20 }}
                  message="The Twitch Extension is currently disabled"
                  banner
                />
              )}
              <Steps
                current={settings.twitchExtensionConfigStep}
                status={
                  settings.twitchExtensionConfigStatus === "start"
                    ? undefined
                    : settings.twitchExtensionConfigStatus
                }
              >
                <Steps.Step title="Set Password" description="For sharing match stats" />
                <Steps.Step title="Configure Backend" description="" />
                <Steps.Step title="Set up twitch extension" description="" />
              </Steps>
              {settings.twitchExtensionConfigStep === 0 &&
              settings.twitchExtensionConfigStatus !== "error" ? (
                <>
                  <Form.Item wrapperCol={{ span: 24 }}>
                    <Text>
                      Set a password that ensures only you can update the data displayed on your
                      twitch extension.
                    </Text>
                  </Form.Item>
                  <Form.Item label={"Set a password"} required extra="Minimum 8 characters">
                    <Input.Password
                      disabled={!settings.twitchExtension}
                      value={twitchEPassword}
                      onChange={handleTwitchExtensionPasswordChange}
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                    <Button
                      type="primary"
                      disabled={
                        twitchEPassword.length < 8 || !settings.twitchExtension ? true : undefined
                      }
                      onClick={() =>
                        window.electron.ipcRenderer.configureTwitchExtensionBackend(
                          twitchEPassword,
                        )
                      }
                    >
                      Configure
                    </Button>
                  </Form.Item>
                </>
              ) : null}
              {settings.twitchExtensionConfigStep === 1 &&
              settings.twitchExtensionConfigStatus !== "error" ? (
                <>
                  <Result
                    icon={<Spin indicator={<LoadingOutlined spin />} />}
                    title="Configurating..."
                  />
                </>
              ) : null}
              {settings.twitchExtensionConfigStep === 2 &&
              settings.twitchExtensionConfigStatus !== "error" ? (
                <>
                  <Form.Item wrapperCol={{ span: 24 }}>
                    <Text>
                      Now go on twitch install the extension and in the extension settings set
                      UUID field.
                    </Text>
                  </Form.Item>
                  <Form.Item label={"Your UUID"}>
                    <Input.Password
                      disabled={!settings.twitchExtension}
                      value={settings.twitchExtensionUUID}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                    <Button
                      disabled={!settings.twitchExtension}
                      danger
                      onClick={() =>
                        window.electron.ipcRenderer.resetTwitchExtensionBackendConfig()
                      }
                    >
                      Reset
                    </Button>
                  </Form.Item>
                </>
              ) : null}
              {settings.twitchExtensionConfigStatus === "error" ? (
                <>
                  <Result
                    status="error"
                    title="Something went wrong."
                    subTitle="Check your internet connection and try again. In case the issue persists please let us know."
                    extra={[
                      <>
                        {" "}
                        <Button
                          disabled={!settings.twitchExtension}
                          danger
                          onClick={() =>
                            window.electron.ipcRenderer.resetTwitchExtensionBackendConfig()
                          }
                        >
                          Reset
                        </Button>
                      </>,
                    ]}
                  />
                </>
              ) : null}
            </Collapse.Panel>
            <Collapse.Panel
              collapsible="header"
              header={
                <>
                  Streamer Mode{" "}
                  <Helper
                    text={
                      <>
                        Learn more about the setup{" "}
                        <Typography.Link
                          onClick={() =>
                            window.electron.ipcRenderer.openInBrowser(
                              "https://github.com/cohstats/coh2stats/blob/master/packages/app/README.md#stream-overlay",
                            )
                          }
                        >
                          here
                        </Typography.Link>
                      </>
                    }
                    style={{ paddingLeft: "5px" }}
                  />{" "}
                </>
              }
              extra={
                <Switch
                  checked={settings.streamOverlay}
                  onChange={handleStreamerModeChange}
                  checkedChildren={"enabled"}
                  unCheckedChildren={"disabled"}
                />
              }
              key="3"
            >
              {settings.streamOverlay ? null : (
                <Alert
                  style={{ marginBottom: 20 }}
                  message="The Steam Overlay is currently disabled"
                  banner
                />
              )}
              <Form.Item label={"Streamer view server port"}>
                <InputNumber
                  disabled={!settings.streamOverlay}
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
                  disabled={!settings.streamOverlay}
                  value={settings.streamOverlayPosition}
                  onChange={handleStreamViewLayoutChange}
                >
                  <Select.Option value="top">Top</Select.Option>
                  <Select.Option value="left">Left</Select.Option>
                </Select>
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </WindowTitlebar>
    </>
  );
};

export default App;
