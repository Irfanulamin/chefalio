import axiosInstance from "@/hooks/axios/interceptors";
import { useState } from "react";
import type { AIMatch, AIGenerated, AIResult } from "@/types/ai.type";

export type { AIMatch, AIGenerated, AIResult };

export function useAIAssistant() {
  const [result, setResult] = useState<AIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggest = async (ingredients: string[]) => {
    if (ingredients.length === 0) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await axiosInstance.post<AIResult>(
        "/ai/suggest",
        { ingredients },
        { timeout: 60_000 },
      );
      setResult(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { suggest, result, isLoading, error, reset };
}
