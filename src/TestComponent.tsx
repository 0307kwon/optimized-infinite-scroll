import styled from "@emotion/styled";
import InfiniteScroll from "optimized-infinite-scroll/InfiniteScroll";
import React, { useEffect, useState } from "react";
import { RootDiv } from "TestComponent.styles";
import { fakeInfiniteFetch } from "testUtil";
import { FeedType } from "types";
import Feed from "./components/Feed";

const TestComponent = () => {
  const [feeds, setFeeds] = useState<FeedType[]>([]);

  const getNewData = async () => {
    const { data } = await fakeInfiniteFetch();

    setFeeds((prev) => [...prev, ...data]);
  };

  return (
    <RootDiv>
      <InfiniteScroll getNewData={getNewData} column={3}>
        {feeds.map((feed, index) => (
          <Feed feed={feed} />
        ))}
      </InfiniteScroll>
    </RootDiv>
  );
};

export default TestComponent;
