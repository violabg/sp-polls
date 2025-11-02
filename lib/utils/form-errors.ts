/**
 * Form Error Handling Utility
 * Provides Italian error messages and error handling for form validation
 */

import { italianLabels } from "../types/italian";

/**
 * Standard error messages in Italian
 */
export const ITALIAN_ERROR_MESSAGES = {
  REQUIRED_FIELD: italianLabels.required_field,
  INVALID_EMAIL: italianLabels.invalid_email,
  INVALID_FORMAT: italianLabels.invalid_format,
  GENERIC_ERROR: "Si è verificato un errore",
  NETWORK_ERROR: "Errore di connessione",
  TIMEOUT_ERROR: "Richiesta scaduta",
  VALIDATION_ERROR: "Errore di validazione",
  UNAUTHORIZED_ERROR: "Non autorizzato",
  FORBIDDEN_ERROR: "Accesso negato",
  NOT_FOUND_ERROR: "Non trovato",
} as const;

/**
 * Create a validation error message
 * @param fieldName - The name of the field that failed
 * @param type - Type of validation error
 * @returns Italian error message
 */
export function getValidationErrorMessage(
  fieldName: string,
  type: string
): string {
  switch (type) {
    case "required":
      return italianLabels.required_field;
    case "email":
      return italianLabels.invalid_email;
    case "minLength":
      return italianLabels.min_length(1); // Default, should be overridden with actual min
    case "maxLength":
      return italianLabels.max_length(100); // Default, should be overridden with actual max
    default:
      return italianLabels.invalid_format;
  }
}

/**
 * Format field errors for display
 * @param fieldErrors - Object with field names and their errors
 * @returns Formatted error messages
 */
export function formatFieldErrors(
  fieldErrors: Record<string, string[]>
): Record<string, string> {
  const formatted: Record<string, string> = {};

  for (const [field, errors] of Object.entries(fieldErrors)) {
    // Take the first error for each field
    formatted[field] = errors[0] || ITALIAN_ERROR_MESSAGES.VALIDATION_ERROR;
  }

  return formatted;
}

/**
 * Extract error message from unknown error type
 * @param error - Unknown error object
 * @returns Italian error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return ITALIAN_ERROR_MESSAGES.GENERIC_ERROR;
}

/**
 * Check if error is a specific type
 * @param error - Error object
 * @param type - Error type to check
 * @returns True if error matches type
 */
export function isErrorType(error: unknown, type: string): boolean {
  if (error instanceof Error) {
    return error.name === type;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === type
  ) {
    return true;
  }

  return false;
}
