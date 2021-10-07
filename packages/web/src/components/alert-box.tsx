import React from "react";
import { Alert } from "antd";

import hasIn = require("lodash.hasIn");

const alertTypes = [ "success", "info", "warning", "error" ]
const defaultType = "info"

function validateType(type:string) {
    if (hasIn(type, alertTypes)) {
        return type
    }
    return defaultType
}

export const AlertBox: React.FC = (type:string, message:string, description:string) => {
    return (
        <Alert 
            message={message} 
            type={validateType(type)} 
            description={description} 
        />
    );
}
