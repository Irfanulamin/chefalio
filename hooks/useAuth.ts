import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "./axios/interceptors";
import { queryClient } from "@/lib/queryClient";
import type {
  Me,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  Profile,
  UpdateUserPayload,
  ChangePasswordPayload,
} from "@/types/auth.type";

export type { Me, LoginPayload, RegisterPayload, Profile, UpdateUserPayload };

export function useAuth() {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      axiosInstance.get<Me>("/auth/me").then((response) => response.data),
    retry: false,
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
    refetchInterval: (query) => (query.state.data ? 5 * 60 * 1000 : false),
    refetchIntervalInBackground: false,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      axiosInstance
        .post<Me>("/auth/login", payload)
        .then((response) => response.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data);
      if (data.role === "user") {
        router.push("/recipes");
      } else if (data.role === "chef") {
        router.push("/chef/dashboard");
      } else if (data.role === "admin") {
        router.push("/admin/dashboard");
      }
    },
    onError: () => {},
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      axiosInstance
        .post<Me>("/auth/register", payload)
        .then((response) => response.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data);
      if (data.role === "user") {
        router.push("/recipes");
      } else if (data.role === "chef") {
        router.push("/chef/dashboard");
      } else if (data.role === "admin") {
        router.push("/admin/dashboard");
      }
    },
    onError: () => {},
  });

  const logoutMutation = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordPayload) =>
      axiosInstance.post("/auth/forgot-password", data),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordPayload) =>
      axiosInstance.post("/auth/reset-password", data),
    onSuccess: () => {
      router.push("/login?reset=success");
    },
    onError: () => {},
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordPayload) =>
      axiosInstance.post("/auth/change-password", data),
    onSuccess: () => {},
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
  };
}

export function useProfile() {
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axiosInstance.get<Profile>("/auth/profile").then((res) => res.data),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const updateMeMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => {
      const formData = new FormData();
      if (payload.fullName) formData.append("fullName", payload.fullName);
      if (payload.image?.length) formData.append("image", payload.image[0]);
      return axiosInstance
        .patch<Profile>("/users/update/me", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {},
  });

  return {
    profile: profileData,
    isProfileLoading,
    updateProfile: updateMeMutation.mutateAsync,
    isUpdatingProfile: updateMeMutation.isPending,
  };
}
