import React from "react";
import axios from "axios";
import RedditCardDetails from "./reddit-card-details";
import { useState, useEffect } from "react";
import { Card, Typography } from "antd";
const { Title } = Typography;
interface Props {
  height: number;
  width: number;
}
const RedditCard: React.FC<Props> = (size) => {
  const [postData, setpostData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const data = async () => {
    const res = await axios.get(
      "https://www.reddit.com/r/CompanyOfHeroes/top.json?limit=50&t=week",
    );
    setpostData(res?.data?.data?.children);
    setFetched(true);
    return postData;
  };
  useEffect(() => {
    data();
  }, [fetched]);

  return (
    <div>
      <Card style={{ width: size.width, height: size.height, flexGrow: 1 }}>
        <div style={{ overflow: "hidden" }}>
          <Title level={3}>Top Reddit Posts</Title>
          <p>r/CompanyOfHeros</p>
          {postData
            .filter(function (e: any) {
              return e?.data?.link_flair_text === "CoH2";
            })
            .slice(0, 10)
            .map((item: any, index: number) => {
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
                  ></RedditCardDetails>
                )
              );
            })}
        </div>
      </Card>
    </div>
  );
};

export default RedditCard;