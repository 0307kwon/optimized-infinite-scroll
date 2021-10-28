import styled from "@emotion/styled";
import InfiniteScroll from "optimized-infinite-scroll/InfiniteScroll";
import React, { useEffect, useState } from "react";
import { fakeInfiniteFetch } from "testUtil";
import { FeedType } from "types";
import Feed from "./components/Feed";

const TestComponent = () => {
  const [feeds, setFeeds] = useState<FeedType[]>([]);

  useEffect(() => {}, []);

  const getNewData = async () => {
    console.log("뭐지");
    const { data } = await fakeInfiniteFetch();

    setFeeds((prev) => [...prev, ...data]);
  };

  return (
    <InfiniteScroll getNewData={getNewData} column={3}>
      {feeds.map((feed) => (
        <Feed feed={feed} />
      ))}
    </InfiniteScroll>
  );
};

export default TestComponent;
