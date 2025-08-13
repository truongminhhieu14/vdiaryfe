import http from "./api.service";
import {
  INewFeeds,
  IPost,
  LinkMeta,
  LinkMetaResponse,
} from "@/types/post.type";
import { SuccessResponse } from "@/types/response";
import {
  getAccessTokenFormLocalStorage,
  getUserIdFromLocalStorage,
} from "@/utils/auth";
import { AxiosResponse } from "axios";

export interface CreatePostPayload {
  caption: string;
  images: string[];
  videos: string[];
  links: LinkMeta[];
  hashtags: string[];
  mentions: string[];
  privacy: "public" | "friends";
}

const postApi = {
  createPost: async (data: CreatePostPayload): Promise<AxiosResponse<{ result: IPost }>> => {
    return await http.post("/posts", data, {
      headers: {
        Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
        "x-client-id": getUserIdFromLocalStorage(),
        "Content-Type": "application/json",
      },
    });
  },
  getPostByPostId: async (postId: string): Promise<AxiosResponse<{ data: IPost }>> => {
  return await http.get(`/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
      "x-client-id": getUserIdFromLocalStorage(),
    },
  });
},

  getNewFeed: async (page = 1, limit = 10): Promise<AxiosResponse<INewFeeds>> => {
    return await http.get("/posts", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
        "x-client-id": getUserIdFromLocalStorage(),
      },
    });
  },
  
  getLinkMetadata: async (caption: string): Promise<AxiosResponse<LinkMetaResponse>> => {
    return await http.post(
      "/posts/metadata",
      { caption },
      {
        headers: {
          Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
          "x-client-id": getUserIdFromLocalStorage(),
        },
      }
    );
  },

  updatePost: async (postId: string, data: Partial<CreatePostPayload>): Promise<AxiosResponse<{updatePost: IPost}>> => {
    return await http.put(`/posts/${postId}`, data , {
      headers: {
        Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
        "x-client-id": getUserIdFromLocalStorage(),
      },
    })
  },

  deletePost: async (postId: string): Promise<AxiosResponse<SuccessResponse<null>>> => {
    return await http.delete(`/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
        "x-client-id": getUserIdFromLocalStorage(),
      }
    })
  }
};

export default postApi;
