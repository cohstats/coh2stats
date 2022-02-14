import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Link from "antd/lib/typography/Link";
import compareVersions from "compare-versions";
import * as React from "react";
import { useSelector } from "react-redux";
import { selectSettings } from "../../../redux/slice";
import iconBig from "../../../../assets/iconBig.png";
import { useEffect } from "react";
import { events, firebaseInit } from "../../firebase/firebase";
import { Tag, Tooltip } from "antd";
import { DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";

// Because about window is completely new render process we need to init firebase again
firebaseInit();

const App = (): JSX.Element => {
  const settings = useSelector(selectSettings);
  let upToDate = true;
  if (settings.appNewestVersion) {
    upToDate = compareVersions(settings.appVersion, settings.appNewestVersion) >= 0;
  }

  useEffect(() => {
    events.about();
  }, []);

  return (
    <>
      <Row>
        <Col span={8} style={{ paddingRight: 20, paddingLeft: 20 }}>
          <img src={iconBig} style={{ width: "100%" }} alt="App Icon" />
        </Col>
        <Col span={16} style={{ paddingRight: 10 }}>
          <Title style={{ marginBottom: 5 }}>Coh2 Game Stats </Title>
          <Title level={5} style={{ marginTop: 5 }}>
            Version <Tag color={upToDate ? "green" : "red"}>{settings.appVersion}</Tag>{" "}
            {upToDate ? undefined : (
              <>
                <Tooltip
                  title={
                    "To update the app, download the new installer and run it. No uninstall required!"
                  }
                >
                  <Tag icon={<DownloadOutlined />} color="#cd201f">
                    <Link
                      style={{ color: "white" }}
                      onClick={() =>
                        window.electron.ipcRenderer.openInBrowser(settings.appUpdateDownloadLink)
                      }
                    >
                      Download {settings.appNewestVersion}
                    </Link>
                  </Tag>
                </Tooltip>
                <Tag icon={<InfoCircleOutlined />} color="#3b5999">
                  <Link
                    style={{ color: "white" }}
                    onClick={() =>
                      window.electron.ipcRenderer.openInBrowser(settings.appReleaseInfos)
                    }
                  >
                    Release Notes
                  </Link>
                </Tag>
              </>
            )}
          </Title>
          <p>
            <Text>
              <Link
                onClick={() =>
                  window.electron.ipcRenderer.openInBrowser("https://coh2stats.com/")
                }
              >
                Visit our website coh2stats.com
              </Link>
            </Text>
          </p>
          <p>
            <Text>
              Want to help?{" "}
              <Link
                onClick={() =>
                  window.electron.ipcRenderer.openInBrowser(
                    "https://github.com/petrvecera/coh2ladders/issues",
                  )
                }
              >
                Report a bug
              </Link>
              ,{" "}
              <Link
                onClick={() =>
                  window.electron.ipcRenderer.openInBrowser(
                    "https://coh2stats.com/about#donations",
                  )
                }
              >
                make a donation
              </Link>{" "}
              or{" "}
              <Link
                onClick={() =>
                  window.electron.ipcRenderer.openInBrowser(
                    "https://github.com/petrvecera/coh2ladders",
                  )
                }
              >
                get involved!
              </Link>
            </Text>
          </p>
        </Col>
      </Row>
    </>
  );
};

export default App;

// <Text type="secondary"> (up to date)</Text> // for after version
//<Link onClick={() => window.electron.ipcRenderer.openInBrowser(settings.appUpdateDownloadLink)}> </Link>
