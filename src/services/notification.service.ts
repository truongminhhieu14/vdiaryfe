import { INotificationResponse, IUnreadCountResponse } from "@/types/notification.type";
import { getAccessTokenFormLocalStorage, getUserIdFromLocalStorage } from "@/utils/auth";
import { AxiosResponse } from "axios";
import http from "./api.service"

const headers = {
  Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
  "x-client-id": getUserIdFromLocalStorage(),
};

const notificationApi = {
    getNotifications: async (page = 1, limit = 10): Promise<AxiosResponse<{data: INotificationResponse}>> => {
        return await http.get(`/notifications`, {
            params: { page, limit },
            headers
        });
    },

    getUnreadCount: async (): Promise<AxiosResponse<IUnreadCountResponse>> => {
        return await http.get(`/notifications/unread-count`, { headers });
    },

    markAsRead: async (notificationId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await http.patch(`/notifications/${notificationId}/read`, {}, { headers });
    },

    markAllAsRead: async (): Promise<AxiosResponse<{ message: string }>> => {
        return await http.patch(`/notifications/mark-all-read`, {}, { headers });
    },

    deleteNotification: async (notificationId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await http.delete(`/notifications/${notificationId}`, { headers });
    }
}

export default notificationApi;
