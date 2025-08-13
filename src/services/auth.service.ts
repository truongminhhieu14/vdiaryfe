import { ILogin, IRegister, IUpdateProfile } from "@/types/auth.type";
import http from "./api.service";
import {
  getAccessTokenFormLocalStorage,
  getRefreshTokenFormLocalStorage,
  getUserIdFromLocalStorage,
} from "@/utils/auth";

const authApi = {
  signIn: async (data: ILogin) => await http.post("auth/login", data),
  signUp: async (data: IRegister) =>
    await http.post("/auth/register", data),
  logOut: async () =>
    await http.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
          "x-client-id": getUserIdFromLocalStorage(),
        },
      }
    ),
  getProfile: async (): Promise<any> =>
    await http.get("/auth/get-profile"),
  
  getProfileById: async (userId: string): Promise<any> =>
    await http.get(`/auth/get-profile/${userId}`, {}),  
  
  updateProfile: async (data: IUpdateProfile): Promise<any> =>
    await http.patch("/auth/update-profile", data),
};

export default authApi;