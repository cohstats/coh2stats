import React from "react";
import { Col, Row, List, Avatar } from "antd";
import { getCommanderByRaces } from "../../coh/commanders";
import { useHistory, useParams } from "react-router";
import { RaceName } from "../../coh/types";
import routes from "../../routes";

export const CommandersList = () => {
  const { push } = useHistory();

  const { race } = useParams<{
    race: string;
  }>();

  let myData = getCommanderByRaces(race as RaceName);
  myData = myData.filter((commanderData) => {
    return (
      commanderData["commanderName"] !== "undefined" &&
      commanderData["description"] !== "undefined"
    );
  });

  const divStyle = {
    backgroundImage: "url(/resources/generalIcons/" + race + ".png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "350px",
    backgroundPosition: "left top",
    backgroundBlendMode: "overlay",
    backgroundColor: "rgba(255,255,255,0.8)",
  };

  if (myData.length === 0) {
    return (
      <>
        <h1>Race {race} here was not found.</h1>
      </>
    );
  }

  function onCommanderClick(CommanderServerID: string) {
    push(routes.commanderByID(race, CommanderServerID));
  }

  let styleCursorPointer = {
    cursor: "pointer",
  };

  return (
    <div style={divStyle}>
      <Row>
        <Col span={6} />
        <Col span={12}>
          <List
            itemLayout="horizontal"
            dataSource={myData}
            style={{ paddingTop: 50 }}
            renderItem={(item) => (
              <div>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div
                        style={styleCursorPointer}
                        onClick={() => onCommanderClick(item.serverID)}
                      >
                        <Avatar
                          src={"/resources/exportedIcons/" + item.iconSmall + ".png"}
                          shape="square"
                          size={64}
                        />
                        {console.log(item)}
                      </div>
                    }
                    title={
                      <div
                        style={styleCursorPointer}
                        onClick={() => onCommanderClick(item.serverID)}
                      >
                        {item.commanderName}
                      </div>
                    }
                    description={item.description}
                  />
                </List.Item>
              </div>
            )}
          />
        </Col>
        <Col span={6} />
      </Row>
    </div>
  );
};
