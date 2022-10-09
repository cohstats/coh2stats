import React from "react";
import routes from "../../../routes";
import { Avatar } from "antd";
import Text from "antd/es/typography/Text";
import Paragraph from "antd/es/typography/Paragraph";
import { useHistory } from "react-router";
import { getBulletinIconPath } from "../../../coh/bulletins";
import { IntelBulletinData } from "../../../coh/types";

interface IProps {
  bulletinData: IntelBulletinData;
}

const SearchBulletinCard: React.FC<IProps> = ({ bulletinData }) => {
  const { push } = useHistory();

  const iconBulletin = getBulletinIconPath(bulletinData.icon);
  const nameBulletin = bulletinData.bulletinName;
  const descriptionBulletin = bulletinData.descriptionShort;

  const onBulletinClick = () => {
    const urlParam = new URLSearchParams({
      search: nameBulletin,
    });
    push(routes.bulletinsBase() + "?" + urlParam);
  };

  return (
    <div
      style={{ backgroundColor: "white", height: 67, padding: 1 }}
      className={"resultBox"}
      key={nameBulletin + iconBulletin}
      onClick={() => onBulletinClick()}
    >
      <Avatar
        size={62}
        shape="square"
        src={iconBulletin}
        style={{ display: "inline-block", verticalAlign: "top" }}
      />
      <div
        style={{
          display: "inline-block",
          paddingLeft: 5,
          width: 200,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <Text strong ellipsis>
          {nameBulletin}
        </Text>
        <Paragraph ellipsis={{ rows: 2 }}>{descriptionBulletin}</Paragraph>
      </div>
    </div>
  );
};

export default SearchBulletinCard;
