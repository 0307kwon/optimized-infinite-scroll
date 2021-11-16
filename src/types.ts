export interface FeedType {
  title: string;
  imageURL: string;
  contents: string;
}

export type GetNewData = () => Promise<unknown>;
