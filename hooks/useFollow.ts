import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axios";
import type {
  FollowStatus,
  GetFollowStatusResponse,
  GetMyFollowingResponse,
} from "@/types/follow.type";

/** GET /follows/:chefId — is the current user following this chef, and how
   many followers do they have. */
export function useFollowStatus(chefId: string | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ["follow-status", chefId],
    queryFn: () =>
      axiosInstance
        .get<GetFollowStatusResponse>(`/follows/${chefId}`)
        .then((res) => res.data),
    enabled: !!chefId,
    staleTime: 1000 * 30,
  });

  return { status: data?.data, isLoading };
}

/** GET /follows — chef ids the current user follows. Powers the
   notification bell's client-side filter of live socket pushes — the
   authoritative filtering happens server-side in `getRecent`, this is
   just so a push for a chef you don't follow doesn't flash in the tray
   before the next refetch would have excluded it anyway. */
export function useMyFollowing() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-following"],
    queryFn: () =>
      axiosInstance
        .get<GetMyFollowingResponse>("/follows")
        .then((res) => res.data),
    staleTime: 1000 * 60,
  });

  return { followedChefIds: data?.data ?? [], isLoading };
}

function useFollowMutation(action: "follow" | "unfollow") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chefId: string) =>
      (action === "follow"
        ? axiosInstance.post<GetFollowStatusResponse>(`/follows/${chefId}`)
        : axiosInstance.delete<GetFollowStatusResponse>(`/follows/${chefId}`)
      ).then((res) => res.data),

    onMutate: async (chefId) => {
      await queryClient.cancelQueries({ queryKey: ["follow-status", chefId] });
      const previous = queryClient.getQueryData<{ data: FollowStatus }>([
        "follow-status",
        chefId,
      ]);
      const current = previous?.data ?? { isFollowing: false, followerCount: 0 };
      const willFollow = action === "follow";

      queryClient.setQueryData(["follow-status", chefId], {
        ...previous,
        data: {
          isFollowing: willFollow,
          followerCount: Math.max(
            0,
            current.followerCount + (willFollow ? 1 : -1),
          ),
        },
      });

      return { previous };
    },

    onError: (_err, chefId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["follow-status", chefId], context.previous);
      }
    },

    onSettled: (_data, _err, chefId) => {
      queryClient.invalidateQueries({ queryKey: ["follow-status", chefId] });
      queryClient.invalidateQueries({ queryKey: ["my-following"] });
      // The chefs list/grid carries its own denormalized followerCount +
      // isFollowing per card (see ChefCard) — without this, following from
      // the grid updates that one card's local state but the count drifts
      // from the server on the next unrelated refetch.
      queryClient.invalidateQueries({ queryKey: ["chefs"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["chefs-infinite"], exact: false });
    },
  });
}

export function useFollowChef() {
  return useFollowMutation("follow");
}

export function useUnfollowChef() {
  return useFollowMutation("unfollow");
}
