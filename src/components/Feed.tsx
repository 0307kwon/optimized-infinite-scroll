import React from "react";
import { FeedType } from "types";
import styled from "@emotion/styled";

interface Props {
  feed: FeedType;
}

const Feed = ({ feed }: Props) => {
  return (
    <Root>
      <h2>{feed.title}</h2>
      <Image src={feed.imageURL} />
      <p>{feed.contents}</p>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 250px;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.3);
  border-radius: 7px;
  padding: 7px;
`;

const Image = styled.div<{ src: string }>`
  width: 100%;
  height: 100px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position-y: center;
`;

export default Feed;
