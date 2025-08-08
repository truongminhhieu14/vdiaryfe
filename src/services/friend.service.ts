import { IFriendRequestSuccess } from "@/types/friend-request.type";
import http from "./api.service"
import { IFollowingSuccess, IFriend, IFriendSuccess } from "@/types/friend.type";
import { getAccessTokenFormLocalStorage, getUserIdFromLocalStorage } from "@/utils/auth";
import { AxiosResponse } from "axios";

export const getMutualFriends = async (
  targetIds: string[]
): Promise<AxiosResponse<{ data: { count: number; mutualFriends: IFriend[] } }>> => {
  return await http.post(
    "/friends/mutual-friends-batch",
    { targetIds },
    {
      headers: {
        Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
        "x-client-id": getUserIdFromLocalStorage(),
      },
    }
  );
};

const friendApi = {
    getAllFriend: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFriendSuccess}>> => {
        return await http.get("/friends", {
            params: {type: "friends", page, limit},
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    getAllFriendById: async (userId: string, page = 1, limit = 8): Promise<AxiosResponse<{data: IFriendSuccess}>> => {
        return await http.get(`/friends/${userId}`, {
            params: {type: "friends", page, limit},
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    unfriend: async (friendId: string): Promise<AxiosResponse<{data: IFriend}>> => {
        return await http.post("/friends/action", {action: "unfriend", friendId} ,{
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    getSuggestions: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFriend[], pagination: { page: number; limit: number; count: number; hasMore: boolean }}>> => {
        return await http.get("/friends", {
            params: {type: "suggestions", page, limit},
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    addFriend: async (recipientId: string): Promise<AxiosResponse<{data: IFriend}>> => {
        return await http.post("/friends/action", {action: "send", recipientId} ,{
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    getFriendRequests: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFriendRequestSuccess, pagination: { page: number; limit: number; count: number; totalPage: number; hasMore: boolean}}>> => {
        return await http.get("/friends", {
            params: {type: "requests", page, limit},
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    acceptFriendRequest: async (recipientId: string): Promise<AxiosResponse<{data: IFriend}>> => {
        return await http.post("/friends/action", {action: "accept", recipientId} ,{
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    rejectFriendRequest: async (requestId: string): Promise<AxiosResponse<{data: IFriend}>> => {
        return await http.post("/friends/action", {action: "reject", requestId}, {
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    getFollowing: async (page = 1, limit = 10): Promise<AxiosResponse<{data: IFollowingSuccess}>> => {
        return await http.get("/friends", {
            params: {type: "following", page, limit},
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    getAllFolowingById: async (userId: string, page = 1, limit = 10): Promise<AxiosResponse<{data: IFriendSuccess}>> => {
        return await http.get(`/friends/${userId}`, {
            params: {type: "following", page, limit},
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    follow: async (recipientId: string) => {
        return await http.post("/friends/action", {action: "follow", recipientId}, {
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    unfollow: async (recipientId: string) => {
        return await http.post("/friends/action", {action: "unfollow", recipientId}, {
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    getFollowers: async (): Promise<AxiosResponse<{data: IFollowingSuccess}>> => {
        return await http.get("/friends", {
            params: {type: "followers"},
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    getAllFollowerById: async (userId: string, page = 1, limit = 8): Promise<AxiosResponse<{data: IFriendSuccess}>> => {
        return await http.get(`/friends/${userId}`, {
            params: {type: "followers", page, limit},
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            }
        })
    },
    searchFriends: async (keyword: string): Promise<AxiosResponse<{ data: IFriend[] }>> => {
        return await http.get("/friend/search", {
            params: { keyword },
            headers: {
                Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
                "x-client-id": getUserIdFromLocalStorage(),
            },
        });
    },
}

export default friendApi;