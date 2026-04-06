"use client";

import React from "react";
import { Col, Row, Flex, Avatar, Typography } from "antd";
import { getCommanderByRaces, getCommanderIconPath } from "../../../../coh/commanders";
import { RaceName } from "../../../../coh/types";
import routes from "../../../../routes";
import { ExportDate } from "../../../../components/export-date";
import Link from "next/link";
import { Tip } from "../../../../components/tip";
import { CommanderAbilitiesComponent } from "../../../../components/commander-abillities-component";

const { Title } = Typography;

interface CommandersListProps {
  race: string;
}

export const CommandersList = ({ race }: CommandersListProps) => {
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
              <Link
                key={item.serverID}
                href={routes.commanderByID(race, item.serverID)}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Flex
                  gap="middle"
                  align="start"
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.02)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.09)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Avatar
                    src={getCommanderIconPath(item.iconlarge)}
                    shape="square"
                    size={192}
                    style={{ height: "192px", width: "144px" }}
                  />
                  <Flex vertical gap="small" style={{ flex: 1 }}>
                    <Title level={3} style={{ margin: 0 }}>
                      {item.commanderName}
                    </Title>
                    <div>
                      <CommanderAbilitiesComponent
                        commanderDescription={item.description}
                        commanderAbilities={item.abilities}
                      />
                    </div>
                  </Flex>
                </Flex>
              </Link>
            ))}
          </Flex>
          <ExportDate typeOfData={"Commander"} />
        </Col>
      </Row>
    </div>
  );
};
