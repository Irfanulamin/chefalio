import axiosInstance from "./axiosInstance";
import { queryClient } from "@/lib/queryClient";

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      queryClient.clear();
    }

    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
