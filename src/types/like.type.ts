export interface LikeUser {
  _id: string;
  name: string;
  avatar: string;
}

export interface GetAllLikesResponse {
  message: string;
  success: boolean;
  data: LikeUser[];
  pagination: {
    page: number;
    limit: number;
    count: number;
    hasMore: number;
  };
}
