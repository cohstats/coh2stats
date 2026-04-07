import React from "react";
import { Alert, Typography } from "antd";
import config from "../../main/config";

const { Text } = Typography;

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: "20px" }}>
          <Alert
            type="error"
            message="Something went wrong"
            description={
              <div>
                <Text>There was an error rendering the settings form.</Text>
                <br />
                <br />
                <Text strong>Try the following:</Text>
                <ul>
                  <li>Close and reopen the settings window</li>
                  <li>Restart the application</li>
                  <li>
                    If the problem persists, please report it on our{" "}
                    <a
                      href="#"
                      onClick={() =>
                        window.electron.ipcRenderer.openInBrowser(config.githubIssuesURL)
                      }
                    >
                      GitHub Issues
                    </a>
                  </li>
                </ul>
                {this.state.error && (
                  <details style={{ marginTop: 10 }}>
                    <summary>Error Details</summary>
                    <pre style={{ fontSize: 11, overflow: "auto" }}>
                      {this.state.error.toString()}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            }
            showIcon
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
