import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "./axios/interceptors";

interface Me {
  userId: string;
  role: string;
}

interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

interface forgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

interface Profile {
  fullName: string;
  username: string;
  email: string;
  profile_url: string;
  role: string;
}

interface UpdateUserPayload {
  fullName?: string;
  image?: File[]; // this will be a File object or URL string
}

interface changePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      axiosInstance.get<Me>("/auth/me").then((response) => response.data),
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
        router.push("/settings/chef");
      }
    },
    // 👇 do NOT redirect on error, just let it throw back to the caller
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
      }
    },
    // 👇 do NOT redirect on error, just let it throw back to the caller
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
    mutationFn: (data: forgotPasswordPayload) =>
      axiosInstance.post("/auth/forgot-password", data),
    // No need to handle onSuccess or onError here, the form can handle it directly
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordPayload) =>
      axiosInstance.post("/auth/reset-password", data),
    onSuccess: () => {
      // Pass a flag via query param so the login page can show a toast
      router.push("/login?reset=success");
    },
    onError: () => {},
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: changePasswordPayload) =>
      axiosInstance.post("/auth/change-password", data),
    onSuccess: () => {},
  });

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axiosInstance
        .get<Profile>("/auth/profile")
        .then((response) => response.data),
    retry: false,
    staleTime: Infinity,
  });

  const updateMeMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => {
      const formData = new FormData();

      if (payload.fullName) {
        formData.append("fullName", payload.fullName);
      }

      if (payload.image && payload.image.length > 0) {
        formData.append("image", payload.image[0]);
      }

      return axiosInstance
        .patch<Profile>("/users/update/me", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {},
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register: registerMutation.mutateAsync, // mutateAsync re-throws so the form can catch it
    login: loginMutation.mutateAsync, // mutateAsync re-throws so the form can catch it
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    profile: profileData,
    isProfileLoading,
    updateProfile: updateMeMutation.mutateAsync,
    isUpdatingProfile: updateMeMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
  };
}
