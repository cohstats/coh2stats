import React from "react";

import { render } from "@testing-library/react";

import { AlertBox, AlertEvent } from "./alert-box";

function renderAlertBox(params: Partial<AlertEvent>) {
  return render(<AlertBox {...params} />);
}

describe("<AlertBox />", () => {
  test("should display an error with message 'error', details 'this is an error'", async () => {
    const params: AlertEvent = {
      type: "error",
      message: "error",
      description: "this is an error",
      closable: false,
    };
    const { getByTestId } = renderAlertBox({ ...params });
    const errorAlertBox = getByTestId("alert-box"); // eslint-disable-line testing-library/prefer-screen-queries
    const errorMessage = errorAlertBox.getElementsByClassName("ant-alert-message"); // eslint-disable-line testing-library/no-node-access
    expect(errorMessage[0]).toHaveTextContent("error");
    const errorDescription = errorAlertBox.getElementsByClassName("ant-alert-description"); // eslint-disable-line testing-library/no-node-access
    expect(errorDescription[0]).toHaveTextContent("this is an error");
  });
});
