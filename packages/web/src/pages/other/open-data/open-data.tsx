import React from "react";
import { Col, Row, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

const OpenData = () => {
  const yesterdayDate = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate() - 1,
      0,
      0,
      0,
    ),
  );

  const urlForYesterday = `https://storage.coh2stats.com/matches/matches-${
    yesterdayDate.getTime() / 1000
  }.json`;

  return (
    <Row justify="center" style={{ padding: "10px" }}>
      <Col xs={24} xxl={17}>
        <div style={{ maxWidth: 900, paddingTop: 15, margin: "0 auto" }}>
          <Title level={2} style={{ textAlign: "center" }}>
            COH2 Stats - Open Data
          </Title>
          <Title level={3}>COH2 Match Data</Title>
          <Paragraph>
            COH2 Stats stores played matches. This includes all automatch games VS players. Custom
            and AI games are not stored. The games should not include any broken games. Aka 3v3
            game with 2 players. It's recommended to filter the games based on matchtype_id. You
            can download the .json files from our storage. Each JSON file contains all games
            played for a given day which we were able to track.
          </Paragraph>
          <Paragraph>
            The new file is generated every day at ~4 AM UTC time for the previous day. So 30 June
            4 AM we generate a file for 29 June. The data are stored for 60 days. For long term
            scraping you should download only yesterday file each day.
          </Paragraph>
          <Paragraph>
            You can download them from our storage like this
            <Text code>
              https://storage.coh2stats.com/matches/matches-{`{unixTimeStamp}`}.json
            </Text>
          </Paragraph>
          <Paragraph>
            The timestamp is always that day 00:00:00 aka <Text code>1656460800</Text> which is{" "}
            <Text code>Wed Jun 29 2022 00:00:00 GMT+0000</Text> you can get previous day timestamp
            with the code below.
          </Paragraph>
          <Paragraph>
            <pre style={{ fontSize: "0.9em" }}>
              {`const date = new Date(); // Example to get yesterday Unix timestamp in JavaSript
const yesterdayDayTimeStamp =
   Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1, 0, 0, 0) / 1000;`}
            </pre>
          </Paragraph>
          <Paragraph>
            Example url for yesterday matches {yesterdayDate.toDateString()}
            <Paragraph code copyable>
              {urlForYesterday}
            </Paragraph>
          </Paragraph>

          <Paragraph>
            The Data are in JSON format:
            <pre style={{ fontSize: "0.9em" }}>
              {`{
    "matches": [{
        matchhistoryreportresults: PlayerReport[];
        matchtype_id:              number;
        matchhistoryitems:         Matchhistoryitem[];
        description:               string;
        profile_ids:               number[];
        creator_profile_id:        number;
        mapname:                   string;
        startgametime:             number;
        id:                        number;
        completiontime:            number;
        steam_ids:                 string[];
        maxplayers:                number;
        }],
    "timeStamp": "1656460800"
}`}
            </pre>
          </Paragraph>
          <Paragraph>
            <pre style={{ fontSize: "0.9em" }}>
              {`interface PlayerReport {
  matchhistory_id: number;
  profile_id: number;
  resulttype: number;
  teamid: number;
  race_id: number;
  counters: string;
  profile: Record<string, any>;
}`}
            </pre>
          </Paragraph>
          <Paragraph italic style={{ textAlign: "center" }}>
            In case you will use the data, please mention the source and give a shout-out to the
            website coh2stats.com, thank you!
          </Paragraph>
        </div>
      </Col>
    </Row>
  );
};

export default OpenData;
