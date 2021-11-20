import React, { useEffect } from "react";
import { Col, Row, List, Avatar, Badge, Tooltip } from "antd";
import { getCommanderByRaces, getCommanderIconPath } from "../../coh/commanders";
import { useParams } from "react-router";
import { CommanderAbility, RaceName } from "../../coh/types";
import routes from "../../routes";
import { ExportDate } from "../../components/export-date";
import { commanderBase } from "../../titles";
import { capitalize } from "../../utils/helpers";
import { Link } from "react-router-dom";
import { Tip } from "../../components/tip";
import { getExportedIconPath } from "../../coh/helpers";
import Text from "antd/lib/typography/Text";

export const CommandersList = () => {
  const { race } = useParams<{
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
    backgroundPosition: "left top 200px",
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

  return (
    <div style={divStyle}>
      <Row justify="center">
        <Col xs={20} xxl={12}>
          <div style={{ textAlign: "center", paddingTop: 10, fontSize: "larger" }}>
            <Tip
              text={
                <>
                  You can see the most picked Commanders over at{" "}
                  <Link to={routes.statsBase()}>stats page</Link>.
                </>
              }
            />
          </div>
          <List
            itemLayout="horizontal"
            dataSource={myData}
            style={{ paddingTop: 10 }}
            renderItem={(item) => (
              <div>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Link to={routes.commanderByID(race, item.serverID)}>
                        <Avatar
                          src={getCommanderIconPath(item.iconlarge)}
                          shape="square"
                          size={192}
                          style={{ height: "192px", width: "144px" }}
                        />
                      </Link>
                    }
                    title={
                      <Link to={routes.commanderByID(race, item.serverID)}>
                        {item.commanderName}
                      </Link>
                    }
                    description={
                      <CommanderAbilitiesComponent
                        commanderDescription={item.description}
                        commanderAbilities={item.abilities}
                      />
                    }
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

type CommanderAbilityProps = {
  commanderAbilities: Array<CommanderAbility>;
  commanderDescription: string;
};

const CommanderAbilitiesComponent = (props: CommanderAbilityProps) => {
  return (
    <>
      <Row style={{ paddingBottom: 16, paddingTop: 16 }}>
        <Text>{props.commanderDescription}</Text>
      </Row>
      <br />
      <Row>
        {props.commanderAbilities.map((item: CommanderAbility) => {
          return (
            <Col key={item.name}>
              <Tooltip placement={"bottom"} title={item.description}>
                <Avatar
                  alt={item.name}
                  src={getExportedIconPath(item.icon)}
                  shape="square"
                  size={64}
                />
                <Badge
                  count={item.commandPoints}
                  overflowCount={999}
                  showZero
                  offset={[0, -32]}
                />
              </Tooltip>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
