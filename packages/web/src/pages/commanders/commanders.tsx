import React from "react";
import { Col, Row, List, Divider, Avatar, Descriptions, Badge } from "antd";
import { getCommanderData, getCommanderIconPath } from "../../coh/commanders";
import { useParams } from "react-router";
import { ExportDate } from "../../components/export-date";

export const CommanderDetails = () => {
  const { commanderID } = useParams<{
    commanderID: string;
  }>();

  const myData = getCommanderData(commanderID);

  const { race } = useParams<{
    race: string;
  }>();

  const divStyle = {
    backgroundImage: "url(/resources/generalIcons/" + race + ".png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "350px",
    backgroundPosition: "left top",
    backgroundBlendMode: "overlay",
    backgroundColor: "rgba(255,255,255,0.8)",
  };

  if (!myData) {
    return (
      <>
        <h1>Commander ID {commanderID} was not found.</h1>
      </>
    );
  }

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
                  src={getCommanderIconPath(myData.iconlarge)}
                  width="auto"
                  height="auto"
                  alt={myData.commanderName}
                />
                <h2 style={{ textAlign: "center", margin: "-5px 0px 0px 0px" }}>{myData.races[0]}</h2>
              </Col>
              <Col span={1}></Col>
              <Col xs={20} xl={17}>
                <h1>{myData.commanderName}</h1>
                {myData.description}</Col>
            </Row>
          </Col>
        </Row>

        <Row justify="center">
          <Col xs={20} xl={12}>
            <Divider />
            <List
              itemLayout="horizontal"
              dataSource={myData.abilities}
              renderItem={(item: Record<string, any>) => (
                <div>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <div>
                          <Avatar
                            src={"/resources/exportedIcons/" + item.icon + ".png"}
                            shape="square"
                            size={64}
                          />
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
