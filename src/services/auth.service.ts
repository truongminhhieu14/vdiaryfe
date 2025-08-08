import { ILogin, IRegister, IUpdateProfile } from "@/types/auth.type";
import http from "./api.service";
import {
  getAccessTokenFormLocalStorage,
  getRefreshTokenFormLocalStorage,
  getUserIdFromLocalStorage,
} from "@/utils/auth";

const authApi = {
  signIn: async (data: ILogin) => await http.post("auth/login", data),
  signUp: async (data: Omit<IRegister, "confirmPassword">) =>
    await http.post("/auth/register", data),
  logOut: async () =>
    await http.post(
      "/auth/logOut",
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
          "x-client-id": getUserIdFromLocalStorage(),
        },
      }
    ),
  getProfile: async (): Promise<any> =>
    await http.get("/auth/get-profile", {
      headers: {
        Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
        "x-client-id": getUserIdFromLocalStorage(),
      },
    }),
  getProfileById: async (userId: string): Promise<any> =>
  await http.get(`/auth/get-profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
    },
  }),  
  updateProfile: async (data: IUpdateProfile): Promise<any> =>
    await http.patch("/auth/update-profile", data, {
      headers: {
        Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
        "x-client-id": getUserIdFromLocalStorage(),
      },
    }),
};

export default authApi;