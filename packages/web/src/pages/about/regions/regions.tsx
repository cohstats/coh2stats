import React from "react";
import { Typography } from "antd";
import { RegionSelector } from "../../../components/region-selector";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const Regions: React.FC = () => {
  const checkMark = <CheckCircleTwoTone twoToneColor="#52c41a" />;
  const notSupported = <CloseCircleTwoTone twoToneColor="#c40c0f" />;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: 10 }}>
      <Title>Regions setting</Title>
      <Paragraph>
        In some regions, such as China and Russia (+ other restricted countries) the BE systems of
        coh2stats might be blocked, because we are hosted at Google Cloud Platform.
      </Paragraph>
      <Paragraph>
        If you are from mentioned region and the site works for you, there is no need to change.
        <br />
        Otherwise please change the region in the selector bellow.
      </Paragraph>
      <Paragraph>
        {" "}
        <RegionSelector bordered={true} />
      </Paragraph>

      <Paragraph>
        Some features of the site might still not be accessible.
        <br />
        <Text strong>Support:</Text>
        <ul>
          <li>Search {checkMark}</li>
          <li>Commanders & Bulletins {checkMark}</li>
          <li>
            Player cards
            <ul>
              <li>{checkMark} Player Standings </li>
              <li>{checkMark} Player Recent Matches </li>
              <li>{notSupported} Player Historic Matches </li>
            </ul>
          </li>
          <li>
            Live Games
            <ul>
              <li>{checkMark} List of Live Games</li>
              <li>{notSupported} Overall table of live games </li>
            </ul>
          </li>
          <li>
            Leaderboards
            <ul>
              <li>{checkMark} Live leaderboards</li>
              <li>{notSupported} Historic Leaderboards </li>
            </ul>
          </li>
          <li>
            Stats
            <ul>
              <li>{notSupported} Custom stats range - To be Fixed</li>
              <li>{notSupported} Other direct stats </li>
            </ul>
          </li>
          <li>Recent Games {notSupported}</li>
          <li>Map Stats {notSupported}</li>
          <li>Amount of online players & other small stats over the page {notSupported}</li>
        </ul>
      </Paragraph>
    </div>
  );
};

export default Regions;
