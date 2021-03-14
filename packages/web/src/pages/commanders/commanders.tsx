import React from "react";
import { Col, Row, List, Divider, Avatar, Descriptions, Badge } from "antd";
import { getCommanderData } from "../../coh/commanders";
import { useParams } from "react-router";

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
          <Col span={6}></Col>
          <Col style={{ padding: "2vh" }} span={12}></Col>
          <Col span={6}></Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <Col span={4}></Col>
          <Col style={{ padding: "0px 20px 0px 0px" }} flex="100px">
            <img
              src={"/resources/exportedIcons/" + myData.iconlarge + ".png"}
              width="130"
              height="169"
            />
            <h2 style={{ textAlign: "center", margin: "-5px 0px 0px 0px" }}>{myData.races[0]}</h2>
          </Col>
          <Col span={10}>
            <h1>{myData.commanderName}</h1>
            <Descriptions>
              <Descriptions.Item>{myData.description}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={6}></Col>
        </Row>

        <Row>
          <Col span={6}></Col>
          <Col span={12}>
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
                          {console.log("/resources/exportedIcons/" + item.icon + ".png")}
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
          </Col>
          <Col span={6}></Col>
        </Row>
      </div>
    </>
  );
};
