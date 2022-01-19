import { Alert, Button, Form, Input, InputNumber, Switch } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectSettings } from '../../../redux/slice';

interface Settings {
  notification: boolean;
  pathToLogFile: string;
  streamerMode: boolean;
  variant: 'topCenter' | 'left';
  useTray: boolean;
  openInBrowser: boolean;
  updateInterval: number;
}

const App = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  const handleUpdateIntervalChange = (value: number) => {
    dispatch(actions.setUpdateInterval(value));
  }
  const handleRunInTrayChange = (checked: boolean) => {
    dispatch(actions.setRunInTray(checked));
  }
  const handleOpenInBrowserChange = (checked: boolean) => {
    dispatch(actions.setOpenLinksInBrowser(checked));
  }
  const handleGameNotificationChange = (checked: boolean) => {
    dispatch(actions.setGameNotification(checked));
  }
  return (
    <>
    {!settings.coh2LogFileFound ? <Alert type="error" message="Could not locate warnings.log file!" description="Either Company of Heroes 2 is not installed or your system configuration is different and you need to locate the warnings.log file manually" banner /> : null}
    <Form labelCol={{span: 8}} wrapperCol={{ span: 10}} layout='horizontal' style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <Form.Item label="Path to warnings.log">
        <Input.Group compact>
          <Form.Item noStyle>
            <Input style={{ width: '70%' }} type={"text"} value={settings.coh2LogFileLocation} disabled/>
          </Form.Item>
          <Form.Item noStyle>
            <Button onClick={window.electron.ipcRenderer.locateLogFile}>Select</Button>
          </Form.Item>
          <Form.Item noStyle>
            <Button onClick={window.electron.ipcRenderer.scanForLogFile}>Scan</Button>
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label={"File check interval"}>
        <InputNumber min={1} addonAfter="Seconds" value={settings.updateInterval} onChange={handleUpdateIntervalChange} />
      </Form.Item>
      <Form.Item label={"Run in tray"}>
        <Switch checked={settings.runInTray} onChange={handleRunInTrayChange} />
      </Form.Item>
      <Form.Item label={"Open detail info in browser"}>
        <Switch checked={settings.openLinksInBrowser} onChange={handleOpenInBrowserChange} />
      </Form.Item>
      <Form.Item label={"Notify when game found"}>
        <Switch checked={settings.gameNotification} onChange={handleGameNotificationChange} />
      </Form.Item>
    </Form>
    </>
  );
};

export default App;
