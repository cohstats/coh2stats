import { CommanderAbility } from "../../coh/types";
import { Avatar, Badge, Col, Row, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import { getExportedIconPath } from "../../coh/helpers";
import React from "react";

type CommanderAbilityProps = {
  commanderAbilities: Array<CommanderAbility>;
  commanderDescription: string;
};

export const CommanderAbilitiesComponent = (props: CommanderAbilityProps) => {
  return (
    <>
      <Row style={{ paddingBottom: 25 }}>
        <Text>{props.commanderDescription}</Text>
      </Row>
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
                  offset={[-16, -32]}
                />
              </Tooltip>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
