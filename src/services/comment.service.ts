import { IComment } from "@/types/comment.type";
import { getAccessTokenFormLocalStorage, getUserIdFromLocalStorage } from "@/utils/auth";
import { AxiosResponse } from "axios";
import http from "./api.service"
import { SuccessResponse } from "@/types/response";

const headers = {
  Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
  "x-client-id": getUserIdFromLocalStorage(),
};

const commentApi = {
    createComments: async (postId: string, text: string, parentId: string | null = null): Promise<AxiosResponse<{ comment: IComment }>> => {
        return await http.post(`/comments/${postId}`, { text, parentId }, {headers});
    },

    createChildComments: async (postId: string, parentCommentId: string, text: string, mentions: string[] = []): Promise<AxiosResponse<{result: IComment}>> => {
        return await http.post(`/comments/reply/${postId}/${parentCommentId}`, {text, mentions}, {headers});
    },
    deleteComments: async (commentId: string): Promise<SuccessResponse<{commentId: string}>> => {
        return await http.delete(`/comments/${commentId}`, {headers})
    },

    getAllComments: async (postId: string, page = 1, limit = 10): Promise<AxiosResponse<IComment[]>> => {
        return await http.get(`/comments/post/${postId}`, {
            params: { limit, page },
            headers
        });
    },
    getChildComments: async(parentCommentId: string): Promise<AxiosResponse<IComment[]>> => {
        return await http.get(`/comments/replies/${parentCommentId}`, {headers})
    },

    getCountAllCommentOfPost: async(postId: string): Promise<AxiosResponse<{countComments: number}>> => {
        return await http.get(`/comments/count/${postId}`, {headers})
    }
}

export default commentApi;