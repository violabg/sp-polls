/**
 * useOptimisticAnswer Hook
 * Wraps useOptimistic for managing optimistic answer list updates
 */

"use client";

import type { Answer } from "@/lib/types";
import { useCallback, useOptimistic } from "react";

interface UseOptimisticAnswerOptions {
  /**
   * Callback when optimistic update fails
   */
  onError?: (error: string) => void;
}

/**
 * Custom hook for optimistic answer list updates
 * Handles adding, updating, and reverting answer changes
 */
export function useOptimisticAnswer(
  initialAnswers: Answer[],
  options?: UseOptimisticAnswerOptions
) {
  const [optimisticAnswers, addOptimisticAnswer] = useOptimistic(
    initialAnswers,
    (state: Answer[], newAnswer: Answer) => {
      // Add new answer to the list optimistically
      return [...state, newAnswer];
    }
  );

  const submitOptimisticAnswer = useCallback(
    async (newAnswer: Answer, submitAction: () => Promise<Answer>) => {
      // Show optimistic update immediately
      addOptimisticAnswer(newAnswer);

      try {
        // Submit to server
        await submitAction();
      } catch (error) {
        // Error will automatically revert due to useOptimistic behavior
        if (options?.onError) {
          options.onError(
            error instanceof Error ? error.message : "An error occurred"
          );
        }
      }
    },
    [addOptimisticAnswer, options]
  );

  return {
    optimisticAnswers,
    submitOptimisticAnswer,
    addOptimisticAnswer,
  };
}
