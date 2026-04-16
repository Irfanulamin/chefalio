import axiosInstance from "./axiosInstance";

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
