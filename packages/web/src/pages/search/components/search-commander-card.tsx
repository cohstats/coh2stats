import React from "react";
import { getCommanderIconPath } from "../../../coh/commanders";
import routes from "../../../routes";
import { Avatar } from "antd";
import Text from "antd/es/typography/Text";
import Paragraph from "antd/es/typography/Paragraph";
import { useHistory } from "react-router";

interface IProps {
  serverID: string;
  iconSmall: string;
  commanderName: string;
  description: string;
  races: Array<string>;
}

const SearchCommanderCard: React.FC<IProps> = ({
  serverID,
  iconSmall,
  commanderName,
  description,
  races,
}) => {
  const { push } = useHistory();

  const commanderIcon = getCommanderIconPath(iconSmall);
  let commanderRace: string;

  races.map((race) => (commanderRace = race));

  const onCommanderClick = (race: string, steamId: string) => {
    push(routes.commanderByID(race, steamId));
  };

  return (
    <div
      style={{ backgroundColor: "white", height: 67, padding: 1 }}
      className={"resultBox"}
      key={commanderName}
      onClick={() => {
        onCommanderClick(commanderRace, serverID);
      }}
    >
      <Avatar
        size={63}
        shape="square"
        src={commanderIcon}
        style={{ display: "inline-block", verticalAlign: "top" }}
      />
      <div style={{ display: "inline-block", paddingLeft: 5, width: 200, textAlign: "left" }}>
        <Text strong ellipsis>
          {commanderName}
        </Text>
        <br />
        <Paragraph ellipsis={{ rows: 2 }}>{description}</Paragraph>
      </div>
    </div>
  );
};

export default SearchCommanderCard;
