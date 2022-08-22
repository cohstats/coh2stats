import React from "react";
import { Alert } from "antd";

const defaultCloseable = false;

export interface AlertEvent {
  /** Type of Alert styles, options:`success`, `info`, `warning`, `error` */
  type: "success" | "info" | "warning" | "error";
  /** Content of Alert */
  message: React.ReactNode | string;
  /** Additional content of Alert */
  description?: React.ReactNode | string;
  /** Whether Alert can be closed */
  closable?: boolean;
  style?: Record<string, any>;
}

export const AlertBox: React.FC<AlertEvent> = (event: AlertEvent) => {
  const finalStyle = { ...{ margin: 10, maxWidth: 450 }, ...event.style };

  return (
    <Alert
      data-testid="alert-box"
      message={event.message}
      type={event.type}
      description={event.description}
      closable={event.closable ?? defaultCloseable}
      style={finalStyle}
    />
  );
};
