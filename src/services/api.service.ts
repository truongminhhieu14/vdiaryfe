import HttpStatusCode from "@/constant/statusCode";
import { authResponse } from "@/types/response";
import { getNewAccessToken } from "@/utils/api";
import { clearLocalStorage, getAccessTokenFormLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage, setUserIdToLocalStorage } from "@/utils/auth";
import axios, {AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";


const axiosApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, 
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

class ApiService {
  private accessToken: string;
  axiosInstance: AxiosInstance = axiosApiInstance;
  constructor() {
    this.accessToken = getAccessTokenFormLocalStorage();
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/auths/signIn') {
          const data = response.data as authResponse
          this.accessToken = data.metadata?.accessToken
          setAccessTokenToLocalStorage(this.accessToken)
          setRefreshTokenToLocalStorage(data.metadata?.refreshToken)
          setUserIdToLocalStorage(data.metadata.user._id)
        } 
        else if (url === '/auths/logOut' && response.status === HttpStatusCode.Ok) {
          this.accessToken = ''
          clearLocalStorage()
        }
        return response
      },
      function (error: AxiosError) {
        const originalConfig = error.config as InternalAxiosRequestConfig
        if(error.response?.status === HttpStatusCode.Unauthorized){
          (async () => {
            try{
              const newAccessToken = await getNewAccessToken()
              setAccessTokenToLocalStorage(newAccessToken)
              originalConfig.headers['Authorization'] = `Bearer ${newAccessToken}`
              try {
                await axiosApiInstance.request(originalConfig as InternalAxiosRequestConfig)
              } catch (error) {
                return Promise.reject(error)
              }
            }
            catch (error){
              clearLocalStorage()
              Promise.reject(error)
            }
          })()

        }
        return Promise.reject(error)
      }
    )
  }
}

export default new ApiService().axiosInstance;