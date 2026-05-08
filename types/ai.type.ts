export interface AIMatch {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  images: string[];
  tags: string[];
  lovedCount: number;
  matchCount: number;
  authorId: {
    _id: string;
    fullName: string;
    profile_url?: string;
    username: string;
  };
}

export interface AIGenerated {
  title: string;
  description: string;
  difficulty: string;
  servings: number;
  cookTime: string;
  ingredients: string[];
  instructions: { step: number; instruction: string }[];
  tags: string[];
}

export interface AIResult {
  matches: AIMatch[];
  generated: AIGenerated | null;
}
