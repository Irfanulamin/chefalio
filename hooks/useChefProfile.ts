import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axios";
import type {
  GetChefProfileResponse,
  UpsertChefProfilePayload,
} from "@/types/chef-profile.type";

/** GET /chef-profile/:chefId — public view of a chef's extended profile */
export function useChefProfile(chefId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["chef-profile", chefId],
    queryFn: () =>
      axiosInstance
        .get<GetChefProfileResponse>(`/chef-profile/${chefId}`)
        .then((r) => r.data),
    staleTime: 1000 * 60,
    enabled: !!chefId,
  });
  return { profile: data?.data ?? null, isLoading };
}

/** GET /chef-profile/me — chef views their own profile (for settings pre-fill) */
export function useMyChefProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ["chef-profile", "me"],
    queryFn: () =>
      axiosInstance
        .get<GetChefProfileResponse>("/chef-profile/me")
        .then((r) => r.data),
    staleTime: 1000 * 60,
  });
  return { profile: data?.data ?? null, isLoading };
}

/** PATCH /chef-profile/me — chef upserts their extended profile */
export function useUpsertChefProfile() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: UpsertChefProfilePayload) =>
      axiosInstance
        .patch<GetChefProfileResponse>("/chef-profile/me", payload)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chef-profile"] });
    },
  });
  return { upsertProfile: mutateAsync, isPending };
}
