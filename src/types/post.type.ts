export interface LinkMeta {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}
export interface IUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface IPost {
  _id: string;
  caption: string;
  images: string[];
  videos: string[];
  links: LinkMeta[];
  author: IUser
  hashtags: string[];
  mentions: string[];
  likes: string[];
  privacy: "public" | "friends";
  createdAt: string
}
export interface LinkMetaResponse {
  data: LinkMeta[];
}

export interface INewFeeds {
  userId: string,
  posts: IPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
