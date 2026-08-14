export interface FollowStatus {
  isFollowing: boolean;
  followerCount: number;
}

export interface GetFollowStatusResponse {
  success: boolean;
  statusCode: number;
  data: FollowStatus;
}

export interface GetMyFollowingResponse {
  success: boolean;
  statusCode: number;
  data: string[];
}
