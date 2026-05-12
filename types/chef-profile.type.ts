export interface Achievement {
  title: string;
  description?: string;
  year?: number;
}

export interface ChefProfile {
  _id: string;
  chefId: string;
  bio?: string;
  genres: string[];
  achievements: Achievement[];
}

export interface GetChefProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ChefProfile | null;
}

export interface UpsertChefProfilePayload {
  bio?: string;
  genres?: string[];
  achievements?: Achievement[];
}
