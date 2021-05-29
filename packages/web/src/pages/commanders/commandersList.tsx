import React, { useEffect } from "react";
import { Col, Row, List, Avatar } from "antd";
import { getCommanderByRaces, getCommanderIconPath } from "../../coh/commanders";
import { useHistory, useParams } from "react-router";
import { RaceName } from "../../coh/types";
import routes from "../../routes";
import { ExportDate } from "../../components/export-date";
import { commanderBase } from "../../titles";
import { capitalize } from "../../helpers";

export const CommandersList = () => {
  const { push } = useHistory();

  const { race } =
    useParams<{
      race: string;
    }>();

  useEffect(() => {
    document.title = `${commanderBase} - ${capitalize(race)}`;
  }, [race]);

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
      <Row justify="center">
        <Col xs={20} xxl={12}>
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
                          src={getCommanderIconPath(item.iconSmall)}
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
          <ExportDate typeOfData={"Commander"} />
        </Col>
      </Row>
    </div>
  );
};
