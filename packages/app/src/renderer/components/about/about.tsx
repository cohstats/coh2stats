import React from "react";
import Modal from "antd/es/modal/Modal";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";
import bigIcon from "../../../../assets/ms-icon-310x310.png";
import Title from "antd/es/typography/Title";
import { Tag, Tooltip } from "antd";
import { DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import Text from "antd/es/typography/Text";
import { KofiDonate } from "../donate/kofi-donate";
import compareVersions from "compare-versions";
import { useSelector } from "react-redux";
import { selectSettings } from "../../../redux/slice";

interface Props {
  modalState: boolean;
  setModalState: any;
}

const AboutModal: React.FC<Props> = ({ modalState, setModalState }) => {
  const settings = useSelector(selectSettings);
  let upToDate = true;
  if (settings.appNewestVersion) {
    upToDate = compareVersions(settings.appVersion, settings.appNewestVersion) >= 0;
  }

  return (
    <>
      <Modal
        title="About the app"
        open={modalState}
        centered
        onOk={() => {
          setModalState(false);
        }}
        onCancel={() => {
          setModalState(false);
        }}
        width={750}
      >
        <Row>
          <Col span={8} style={{ paddingRight: 20, paddingLeft: 20 }}>
            <img src={bigIcon} style={{ width: 200, height: 200 }} alt="App Icon" />
          </Col>
          <Col span={16} style={{ paddingRight: 10 }}>
            <Title style={{ marginBottom: 5 }}>COH2 Game Stats </Title>
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
                          window.electron.ipcRenderer.openInBrowser(
                            settings.appUpdateDownloadLink,
                          )
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
                      "https://github.com/cohstats/coh2stats/issues",
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
                    window.electron.ipcRenderer.openInBrowser("https://discord.gg/jRrnwqMfkr")
                  }
                >
                  join our discord and get involved!
                </Link>
              </Text>
            </p>
            <KofiDonate />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default AboutModal;
