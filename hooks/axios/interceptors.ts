import { queryClient } from "@/lib/queryClient";
import axiosInstance from "./axiosInstance";
// 👈 create this shared instance

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 👇 Handle expired/invalid JWT globally
    if (error?.response?.status === 401) {
      queryClient.clear();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(error); // still reject so callers know
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
