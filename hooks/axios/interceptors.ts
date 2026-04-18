import axiosInstance from "./axiosInstance";
import { queryClient } from "@/lib/queryClient";

const GUEST_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/",
];

const isGuestRoute = () =>
  GUEST_ROUTES.some((route) => window.location.pathname.startsWith(route));

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && !isGuestRoute()) {
      queryClient.clear();
      window.location.href = "/login";
      return Promise.reject(error);
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
