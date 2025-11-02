/**
 * Form Action Types
 * Defines interfaces for form submission states and responses
 */

/**
 * Generic form action state
 * Used by useActionState hook to manage form submission state
 */
export interface FormActionState<T = unknown> {
  pending: boolean;
  data?: T;
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
}

/**
 * Error response from server action
 */
export interface FormErrorResponse {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Success response from server action
 */
export interface FormSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Union type for server action responses
 */
export type FormActionResponse<T = unknown> =
  | FormErrorResponse
  | FormSuccessResponse<T>;

/**
 * Generic async server action function type
 */
export type ServerAction<TInput, TOutput = unknown> = (
  input: TInput
) => Promise<FormActionResponse<TOutput>>;
