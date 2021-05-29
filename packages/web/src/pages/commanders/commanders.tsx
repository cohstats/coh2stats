import React, { useEffect } from "react";
import { Col, Row, List, Divider, Avatar, Badge } from "antd";
import { getCommanderData, getCommanderIconPath } from "../../coh/commanders";
import { useParams } from "react-router";
import { ExportDate } from "../../components/export-date";
import firebase from "../../analytics";
import { getExportedIconPath, getGeneralIconPath } from "../../coh/helpers";
import { commanderBase } from "../../titles";

export const CommanderDetails = () => {
  const { commanderID } =
    useParams<{
      commanderID: string;
    }>();

  // We want to scroll top when we go to this page from the stats page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const commanderData = getCommanderData(commanderID);

  const { race } =
    useParams<{
      race: string;
    }>();

  const divStyle = {
    backgroundImage: `url(${getGeneralIconPath(race)})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "350px",
    backgroundPosition: "left top",
    backgroundBlendMode: "overlay",
    backgroundColor: "rgba(255,255,255,0.8)",
  };

  if (!commanderData) {
    return (
      <>
        <h1>Commander ID {commanderID} was not found.</h1>
      </>
    );
  }

  // Set page title
  document.title = `${commanderBase} - ${commanderData.commanderName}`;

  firebase.commanderDisplayed(commanderData.commanderName, commanderData.races[0]);

  return (
    <>
      <div style={divStyle}>
        <Row>
          <Col span={6} />
          <Col style={{ padding: "2vh" }} span={12} />
          <Col span={6} />
        </Row>
        <Row justify="center">
          <Col xs={20} xl={12}>
            <Row>
              <Col flex="100px">
                <img
                  src={getCommanderIconPath(commanderData.iconlarge)}
                  width="auto"
                  height="auto"
                  alt={commanderData.commanderName}
                />
                <h2 style={{ textAlign: "center", margin: "-5px 0px 0px 0px" }}>
                  {commanderData.races[0]}
                </h2>
              </Col>
              <Col span={1} />
              <Col xs={20} xl={17}>
                <h1>{commanderData.commanderName}</h1>
                {commanderData.description}
              </Col>
            </Row>
          </Col>
        </Row>

        <Row justify="center">
          <Col xs={20} xl={12}>
            <Divider />
            <List
              itemLayout="horizontal"
              dataSource={commanderData.abilities}
              renderItem={(item: Record<string, any>) => (
                <div>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <div>
                          <Avatar src={getExportedIconPath(item.icon)} shape="square" size={64} />
                          <Badge count={0} overflowCount={999} showZero offset={[0, -32]}>
                            <a href="#" className="head-example" />
                          </Badge>
                        </div>
                      }
                      title={item.name}
                      description={item.description}
                    />
                  </List.Item>
                </div>
              )}
            />
            <ExportDate typeOfData={"Commander"} />
          </Col>
        </Row>
      </div>
    </>
  );
};
