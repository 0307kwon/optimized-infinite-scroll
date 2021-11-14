import { FeedType } from "types";

interface NetworkResponse {
  data: FeedType[];
}

const FEEDS_COUNT_PER_REQUEST = 40;

const getRandomInteger = (min: number, max: number) => {
  return min + Math.round(Math.random() * (max - min));
};

const MOCK_DATA: FeedType = {
  title: "피드제목",
  imageURL: "https://avatars.githubusercontent.com/u/48755175?v=4",
  contents: "하하하",
};

export const fakeInfiniteFetch = (): Promise<NetworkResponse> => {
  const pendingTime = getRandomInteger(1, 3) * 250;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [...Array(FEEDS_COUNT_PER_REQUEST)].map(() => MOCK_DATA),
      });
    }, pendingTime);
  });
};
