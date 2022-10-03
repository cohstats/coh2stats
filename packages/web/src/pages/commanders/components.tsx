import { CommanderAbility } from "../../coh/types";
import { Avatar, Badge, Col, Row, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import { getExportedIconPath } from "../../coh/helpers";
import React from "react";

type CommanderAbilityProps = {
  commanderAbilities: Array<CommanderAbility>;
  commanderDescription?: string;
  isSmall?: boolean;
};

export const CommanderAbilitiesComponent = ({
  commanderAbilities,
  commanderDescription,
  isSmall,
}: CommanderAbilityProps) => {
  return (
    <>
      {commanderDescription && (
        <Row style={{ paddingBottom: 25 }}>
          <Text>{commanderDescription}</Text>
        </Row>
      )}
      <Row>
        {commanderAbilities.map((item: CommanderAbility) => {
          return (
            <Col key={item.name}>
              <Tooltip placement={"bottom"} title={item.description}>
                <Avatar
                  alt={item.name}
                  src={getExportedIconPath(item.icon)}
                  shape="square"
                  size={isSmall ? 48 : 64}
                />
                <Badge
                  count={item.commandPoints}
                  overflowCount={999}
                  showZero
                  offset={isSmall ? OFFSET_SMALL : OFFSET_DEFAULT}
                  size={isSmall ? "small" : "default"}
                />
              </Tooltip>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

const OFFSET_DEFAULT: [number, number] = [-16, -32];
const OFFSET_SMALL: [number, number] = [-12, -24];
