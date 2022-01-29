import React from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { ApplicationState } from "../../redux/state";
import App from "./app";

export const renderHtml = (state: ApplicationState): string => {
  const content = renderToString(<App state={state} />);
  const html = (
    <>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>CoH2 Game Stats Streamer Overlay</title>
          <link rel="stylesheet" href={"/antd/antd.dark.min.css"} />
        </head>
        <body>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <script
            src="https://cdn.socket.io/4.4.1/socket.io.min.js"
            integrity="sha384-fKnu0iswBIqkjxrhQCTZ7qlLHOFEgNkRmK2vaO/LbTZSXdJfAu6ewRBdwHPhBo/H"
            crossOrigin="anonymous"
          ></script>
          <script src="/assets/streamerOverlay/pageRefresher.js"></script>
        </body>
      </html>
    </>
  );

  return `<!doctype html>\n${renderToStaticMarkup(html)}`;
};
