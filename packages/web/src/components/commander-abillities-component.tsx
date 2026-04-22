import { CommanderAbility } from "@/coh/types";
import { Badge, Col, Row, Tooltip, Typography } from "antd";
import { getExportedIconPath } from "@/coh/helpers";
import React from "react";
import Image from "next/image";

const { Text } = Typography;

const OFFSET_DEFAULT: [number, number] = [-4, 7];
const OFFSET_SMALL: [number, number] = [-4, 7];

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
      <Row gutter={20}>
        {commanderAbilities.map((item: CommanderAbility) => {
          const size = isSmall ? 48 : 64;
          return (
            <Col key={item.name}>
              <Tooltip placement={"bottom"} title={item.description}>
                <>
                  <Badge
                    count={item.commandPoints}
                    overflowCount={999}
                    showZero
                    offset={isSmall ? OFFSET_SMALL : OFFSET_DEFAULT}
                    size={isSmall ? "small" : "medium"}
                  >
                    <Image
                      alt={item.name}
                      src={getExportedIconPath(item.icon)}
                      width={size}
                      height={size}
                      style={{
                        display: "block",
                        borderRadius: 0,
                      }}
                    />
                  </Badge>
                </>
              </Tooltip>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
