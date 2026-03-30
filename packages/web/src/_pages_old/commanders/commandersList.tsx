// @ts-nocheck
import React, { useEffect } from "react";
import { Col, Row, Flex, Avatar, Typography } from "antd";
import { getCommanderByRaces, getCommanderIconPath } from "../../coh/commanders";
import { useParams } from "next/navigation";
import { RaceName } from "../../coh/types";
import routes from "../../routes";
import { ExportDate } from "../../components/export-date";
import { commanderBase } from "../../titles";
import { capitalize } from "../../utils/helpers";
import Link from "next/link";
import { Tip } from "../../components/tip";
import { CommanderAbilitiesComponent } from "../../components/commander-abillities-component";

const { Title } = Typography;

export const CommandersList = () => {
  const params = useParams();
  const race = params?.race as string | undefined;

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
                  <Link href={routes.statsBase()}>stats page</Link>.
                </>
              }
            />
          </div>
          <Flex vertical gap="large" style={{ paddingTop: 10 }}>
            {myData.map((item) => (
              <Flex
                key={item.serverID}
                gap="middle"
                align="start"
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
                }}
              >
                <Link href={routes.commanderByID(race, item.serverID)}>
                  <Avatar
                    src={getCommanderIconPath(item.iconlarge)}
                    shape="square"
                    size={192}
                    style={{ height: "192px", width: "144px" }}
                  />
                </Link>
                <Flex vertical gap="small" style={{ flex: 1 }}>
                  <Link href={routes.commanderByID(race, item.serverID)}>
                    <Title level={3} style={{ margin: 0 }}>
                      {item.commanderName}
                    </Title>
                  </Link>
                  <div>
                    <CommanderAbilitiesComponent
                      commanderDescription={item.description}
                      commanderAbilities={item.abilities}
                    />
                  </div>
                </Flex>
              </Flex>
            ))}
          </Flex>
          <ExportDate typeOfData={"Commander"} />
        </Col>
      </Row>
    </div>
  );
};
