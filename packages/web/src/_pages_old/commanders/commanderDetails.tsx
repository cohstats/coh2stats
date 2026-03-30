// @ts-nocheck
import React, { useEffect } from "react";
import { Col, Row, Flex, Divider, Avatar, Badge, Typography } from "antd";
import { getCommanderData, getCommanderIconPath } from "../../coh/commanders";
import { useParams } from "next/navigation";
import { ExportDate } from "../../components/export-date";
import firebaseAnalytics from "../../analytics";
import { getExportedIconPath, getGeneralIconPath } from "../../coh/helpers";
import { commanderBase } from "../../titles";
import { CommanderAbility } from "../../coh/types";

const { Title, Text } = Typography;

export const CommanderDetails = () => {
  const params = useParams();
  const commanderID = params?.commanderID as string | undefined;
  const race = params?.race as string | undefined;

  const commanderData = getCommanderData(commanderID || "");

  // We want to scroll top when we go to this page from the stats page
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    firebaseAnalytics.commanderDisplayed(
      commanderData?.commanderName || "",
      commanderData?.races[0] || "",
    );
  }, [commanderData]);

  const divStyle = {
    backgroundImage: `url(${getGeneralIconPath(race || "")})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "350px",
    backgroundPosition: "left top 200px",
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
                  width="144"
                  height="192"
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
            <Flex vertical gap="middle">
              {commanderData.abilities.map((item: CommanderAbility, index: number) => (
                <Flex
                  key={`${item.name}-${index}`}
                  gap="middle"
                  align="start"
                  style={{
                    padding: "12px 0",
                    borderBottom:
                      index < commanderData.abilities.length - 1
                        ? "1px solid rgba(5, 5, 5, 0.06)"
                        : "none",
                  }}
                >
                  <div style={{ position: "relative" }}>
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
                    >
                      <></>
                    </Badge>
                  </div>
                  <Flex vertical gap="small" style={{ flex: 1 }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {item.name}
                    </Title>
                    <Text type="secondary">{item.description}</Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
            <ExportDate typeOfData={"Commander"} />
          </Col>
        </Row>
      </div>
    </>
  );
};
