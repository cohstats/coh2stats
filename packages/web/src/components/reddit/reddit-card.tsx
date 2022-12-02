import React from "react";
import RedditCardDetails from "./reddit-card-details";
import { useState, useEffect } from "react";
import { Card, Tooltip, Typography } from "antd";
import { Loading } from "../loading";
import { useMediaQuery } from "react-responsive";
import config from "../../config";

const { Title } = Typography;

interface Props {
  width: number;
}

const RedditCard: React.FC<Props> = (size) => {
  const [data, setData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://www.reddit.com/r/CompanyOfHeroes/top.json?limit=50&t=week",
          { signal: AbortSignal.timeout(config.defaultTimeoutRequestMs) },
        );
        const resData = await res.json();
        const requiredData = resData?.data?.children
          .filter(function (e: any) {
            return `${e?.data?.link_flair_text}`.includes("CoH2");
          })
          .slice(0, 10);
        setData(requiredData);
        setFetched(true);
      } catch (e) {
        setFetched(true);
        setData([]);
        console.error(e);
      }
    })();
  }, []);

  const cardStyle = {
    maxWidth: size.width,
    minWidth: isBigScreen ? size.width : 100,
    minHeight: 720,
    flexGrow: 1,
  };

  return (
    <div>
      <Card style={cardStyle} bodyStyle={{ padding: 12 }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ float: "left" }}>
            {" "}
            <Tooltip title={"Filtered only to COH2 Posts"}>
              <Title level={3}>Top COH2 Reddit Posts</Title>
            </Tooltip>
          </div>
          <div style={{ float: "right" }}>
            {" "}
            <a
              href={"https://www.reddit.com/r/CompanyOfHeroes/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>r/CompanyOfHeroes</p>
            </a>
          </div>
          <div style={{ paddingTop: 50 }}>
            {fetched &&
              data.map((item: any, index: number) => {
                return (
                  item && (
                    <RedditCardDetails
                      key={index}
                      title={item?.data?.title}
                      ups={item?.data?.ups}
                      author={item?.data?.author}
                      imgs={item?.data?.url_overridden_by_dest}
                      created={item?.data?.created}
                      permalink={item?.data.permalink}
                    />
                  )
                );
              })}
            {!fetched && <Loading />}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RedditCard;
