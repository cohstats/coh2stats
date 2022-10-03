import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Image, Typography } from "antd";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

interface Props {
  title: string;
  ups: number;
  author: string;
  imgs: string;
  created: number;
  permalink: string;
}

const { Text, Title } = Typography;
const upVote = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    height="20px"
    width="15px"
    style={{ marginTop: "3px" }}
    fill="#6e6e6e"
  >
    <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
  </svg>
);

const RedditCardDetails: React.FC<Props> = (data) => {
  return (
    <div
      style={{
        borderBottom: "1px solid black",
        display: "flex",
        justifyContent: "space-between",
        padding: "4px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <a
          href={"https://www.reddit.com" + data?.permalink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Title level={5} style={{ textAlign: "start" }}>
            {data?.title}
          </Title>
        </a>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: "4px",
          }}
        >
          <Text
            type="secondary"
            style={{ display: "flex", justifyItems: "center", gap: "2px", fontSize: "14px" }}
          >
            {upVote}
            <Text type="secondary">{data?.ups}</Text>
          </Text>
          <Text type="secondary">•</Text>
          <Text type="secondary">
            <Text type="secondary">u/{data?.author}</Text>
          </Text>
          <Text type="secondary">•</Text>
          <Text type="secondary">{timeAgo.format(new Date(data?.created * 1000))}</Text>
        </div>
      </div>
      <div>
        {data?.imgs &&
          (data?.imgs.includes(".png") ||
          data?.imgs.includes(".jpg") ||
          data?.imgs.includes(".jpeg") ? (
            <Image
              src={data?.imgs}
              alt="cover_img"
              style={{ height: "60px", width: "80px", objectFit: "cover", borderRadius: "2px" }}
            />
          ) : (
            ""
          ))}
      </div>
    </div>
  );
};

export default RedditCardDetails;
