import React from "react";
import { AlertBox } from "./alert-box";
import { Row, Typography } from "antd";
import config from "../config";
const { Text } = Typography;

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Row justify="center" style={{ paddingTop: "10px" }}>
          <AlertBox
            type={"error"}
            message={"There was an error rendering the component."}
            description={
              <div>
                Please refresh the app (press F5). If the problem persists after refreshing the
                page please report it together with <Text strong>screenshot, url</Text> and
                preferably copy all the error text which is in the Console of browser developer
                tools (
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

    return this.props.children;
  }
}

export { ErrorBoundary };
