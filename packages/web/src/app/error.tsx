"use client";

import React from "react";
import { Row, Typography } from "antd";
import { AlertBox } from "../components/alert-box";
import config from "../config";

const { Text } = Typography;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Row justify="center" style={{ paddingTop: "10px" }}>
      <AlertBox
        type={"error"}
        message={"There was an error rendering the component."}
        description={
          <div>
            Please refresh the app (press F5). If the problem persists after refreshing the page
            please report it together with <Text strong>screenshot, url</Text> and preferably copy
            all the error text which is in the Console of browser developer tools (
            <a
              href={"https://updraftplus.com/faqs/how-do-i-open-my-browsers-developer-tools/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              how to open dev tools
            </a>
            ) in our Discord{" "}
            <a href={config.discordInviteLink} target="_blank" rel="noopener noreferrer">
              <img
                width={30}
                height={30}
                src={"/resources/discord-icon.svg"}
                alt={"Discord Logo"}
              />
            </a>
          </div>
        }
      />
    </Row>
  );
}
