import { AxiosResponse } from "axios";
import http from "./api.service";
import { getAccessTokenFormLocalStorage, getUserIdFromLocalStorage } from "@/utils/auth";
import { GetAllLikesResponse } from "@/types/like.type";

const likeApi = {
    handleLike: async (postId: string, action: "like" | "unlike"): Promise<AxiosResponse> => {
      return await http.post(`/likes`, { postId, action }, {
        headers: {
          Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
          "x-client-id": getUserIdFromLocalStorage(),
        },
      });
    },
    
    checkIsLiked: async (postId: string): Promise<AxiosResponse<{ isLiked: boolean }>> => {
      return await http.get(`/likes/check/${postId}`, {
        headers: {
          Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
          "x-client-id": getUserIdFromLocalStorage(),
        },
      });
    },

    seeAllLikes: async(postId: string, page = 1, limit = 10 ): Promise<AxiosResponse<GetAllLikesResponse>> => {
        return await http.get(`/likes/${postId}`, {
             params: { page, limit },
             headers: {
               Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
               "x-client-id": getUserIdFromLocalStorage(),
             },
        }); 
    }
}

export default likeApi;