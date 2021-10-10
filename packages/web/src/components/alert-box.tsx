import React from "react";
import { Alert } from "antd";

const defaultCloseable = true;

export interface AlertEvent {
    /** Type of Alert styles, options:`success`, `info`, `warning`, `error` */
    type: 'success' | 'info' | 'warning' | 'error';
    /** Content of Alert */
    message: React.ReactNode | string;
    /** Additional content of Alert */
    description?: React.ReactNode | string;
    /** Whether Alert can be closed */
    closable?: boolean;
}

export const AlertBox: React.FC<AlertEvent> = (event:AlertEvent) => {
    return (
        <Alert data-testid="alert-box"
            message={event.message} 
            type={event.type} 
            description={event.description} 
            closable={event.closable ?? defaultCloseable}
        />
    );
}
