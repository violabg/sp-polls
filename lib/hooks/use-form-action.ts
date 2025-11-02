/**
 * useFormAction Hook
 * Wraps useActionState with Italian error handling
 * Simplifies form submission state management
 */

"use client";

import type { FormActionResponse } from "@/lib/types/forms";
import { getErrorMessage } from "@/lib/utils/form-errors";
import { useActionState } from "react";

interface UseFormActionOptions {
  /**
   * Callback fired on successful submission
   */
  onSuccess?: (data: unknown) => void;

  /**
   * Callback fired on error
   */
  onError?: (error: string) => void;

  /**
   * Optional initial state
   */
  initialState?: Record<string, unknown>;
}

/**
 * Custom hook for managing form action state
 * Returns pending state and error handling utilities
 */
export function useFormAction<T = unknown>(
  action: (formData: FormData) => Promise<FormActionResponse<T>>,
  options?: UseFormActionOptions
) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: Record<string, unknown>, formData: FormData) => {
      try {
        const result = await action(formData);

        if (!result.success) {
          if (options?.onError) {
            options.onError(result.error);
          }
          return {
            success: false,
            error: result.error,
            fieldErrors: result.fieldErrors,
          };
        }

        if (options?.onSuccess) {
          options.onSuccess(result.data);
        }

        return {
          success: true,
          data: result.data,
        };
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        if (options?.onError) {
          options.onError(errorMessage);
        }
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    options?.initialState || { success: false, error: null }
  );

  return {
    state,
    formAction,
    isPending,
    error: state?.error as string | null,
    fieldErrors: state?.fieldErrors as Record<string, string[]> | undefined,
  };
}
