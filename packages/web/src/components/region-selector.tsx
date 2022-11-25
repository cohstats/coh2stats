import React, { useContext } from "react";
import { Select } from "antd";
import { ConfigContext } from "../config-context";
import { GlobalOutlined } from "@ant-design/icons";

interface IProps {
  bordered?: boolean;
}

export const RegionSelector: React.FC<IProps> = ({ bordered = false }) => {
  const { userConfig, updateUserConfig } = useContext(ConfigContext);

  const handleChange = (newValue: string) => {
    updateUserConfig({ api: newValue });
  };

  return (
    <>
      Region{" "}
      <Select
        defaultValue={userConfig.api}
        style={{ width: 140 }}
        bordered={bordered}
        onChange={handleChange}
        options={[
          {
            value: "gcp",
            label: (
              <>
                <GlobalOutlined /> Global
              </>
            ),
          },
          {
            value: "cf",
            label: "China/Russia",
          },
        ]}
      />
    </>
  );
};
