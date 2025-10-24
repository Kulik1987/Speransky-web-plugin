import axios from "axios";
import { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "",
});

let authRefreshFunction: ((refreshToken: string) => Promise<AxiosResponse>) | null = null;
export const setAuthRefreshFunction = (func: (refreshToken: string) => Promise<AxiosResponse>) => {
  authRefreshFunction = func;
};

const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/verify") &&
      !originalRequest.url?.includes("/auth/jwt/refresh") &&
      !originalRequest.url?.includes("/auth/jwt/logout")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token") || null;

        if (!refreshToken) {
          clearAuthData();
          window.location.href = "/";
          return Promise.reject(error);
        }

        if (!authRefreshFunction) {
          clearAuthData();
          window.location.href = "/";
          return Promise.reject(new Error("Auth refresh function not available."));
        }

        const { data } = await authRefreshFunction(refreshToken);

        localStorage.setItem("access_token", data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        clearAuthData();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
