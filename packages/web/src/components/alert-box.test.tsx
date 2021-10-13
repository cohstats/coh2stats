import React from "react";

import { render, fireEvent, waitForElement } from "@testing-library/react";

import { AlertBox, AlertEvent } from "./alert-box";

function renderAlertBox(params: Partial<AlertEvent>) {
  return render(<AlertBox {...params} />);
}

describe("<AlertBox />", () => {
  test("should display an error with message 'error', details 'this is an error'", async () => {
    const params = {
      type: "error",
      message: "error",
      description: "this is an error",
      closeable: false,
    };
    const { getByTestId } = renderAlertBox({ ...params });
    const errorAlertBox = await getByTestId("alert-box");
    const errorMessage = errorAlertBox.getElementsByClassName("ant-alert-message");
    expect(errorMessage).toHaveValue("error");
    const errorDescription = errorAlertBox.getElementsByClassName("ant-alert-description");
    expect(errorDescription).toHaveValue("this is an error");
    expect(errorAlertBox).toContainElement(<button />);
  });
});
