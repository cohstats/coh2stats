// @ts-nocheck
"use client";

import React from "react";
import RedditCardDetails from "./reddit-card-details";
import { Card, Tooltip, Typography } from "antd";
import { useMediaQuery } from "react-responsive";
import { RedditPost } from "../../utils/reddit";

const { Title } = Typography;

interface Props {
  width: number;
  data: RedditPost[];
}

const RedditCard: React.FC<Props> = ({ width, data }) => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });

  const cardStyle = {
    maxWidth: width,
    minWidth: isBigScreen ? width : 100,
    minHeight: 720,
    flexGrow: 1,
  };

  return (
    <div>
      <Card style={cardStyle} styles={{ body: { padding: 12 } }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Tooltip title={"Filtered only to posts with COH2 tag. Aka doesn't show COH3."}>
              <Title level={3} style={{ margin: 0 }}>
                Top COH2 Reddit Posts
              </Title>
            </Tooltip>
            <a
              href={"https://www.reddit.com/r/CompanyOfHeroes/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p style={{ margin: 0 }}>r/CompanyOfHeroes</p>
            </a>
          </div>
          <div>
            {data && data.length > 0 ? (
              data.map((item: RedditPost, index: number) => {
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
              })
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RedditCard;
