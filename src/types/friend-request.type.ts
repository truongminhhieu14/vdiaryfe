export type IFriendRequest = {
  _id: string;
  requester: {
    _id: string;
    name: string;
    avatar: string;
    background?: string;
    verified?: boolean;
  };
}

 export type IFriendRequestSuccess = {

    requests: IFriendRequest[];
    pagination: {
      page: number;
      limit: number;
      count: number;
      totalPages: number;
      hasMore: boolean;
    };

 }