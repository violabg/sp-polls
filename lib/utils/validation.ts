/**
 * Validation Utility
 * Wraps Zod validation with Italian error messages
 */

import { z } from "zod";
import { italianLabels } from "../types/italian";

/**
 * Common validation schemas with Italian errors
 */
export const ValidationSchemas = {
  // Event validation
  event: z.object({
    title: z
      .string()
      .min(1, italianLabels.required_field)
      .max(100, italianLabels.max_length(100)),
    date: z.coerce
      .date()
      .refine((date) => date > new Date(), "La data deve essere nel futuro"),
    description: z.string().max(500, italianLabels.max_length(500)).optional(),
  }),

  // Question validation
  question: z.object({
    text: z
      .string()
      .min(1, italianLabels.required_field)
      .max(200, italianLabels.max_length(200)),
    type: z.enum(["text", "multiple_choice", "rating"]),
    options: z.array(z.string()).optional(),
    required: z.boolean().optional().default(true),
  }),

  // Answer validation
  answer: z.object({
    response: z.string().min(1, italianLabels.required_field).optional(),
    selected_option: z.number().optional(),
    rating: z.number().min(1).max(5).optional(),
  }),

  // Email validation
  email: z.string().email(italianLabels.invalid_email),

  // Password validation (if needed)
  password: z
    .string()
    .min(8, italianLabels.min_length(8))
    .max(128, italianLabels.max_length(128)),
};

/**
 * Validate data using a schema and return Italian error messages on failure
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result or throws with Italian error
 */
export async function validateWithItalianErrors<T>(
  schema: z.ZodSchema,
  data: unknown
): Promise<T> {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string[]> = {};

      error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(err.message);
      });

      const firstError = error.issues[0];
      const errorMessage = firstError?.message || italianLabels.invalid_format;

      throw new Error(errorMessage);
    }

    throw error;
  }
}

/**
 * Get field-specific error messages from Zod validation
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Object with field names and their error messages
 */
export function getFieldErrors(
  schema: z.ZodSchema,
  data: unknown
): Record<string, string> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((err) => {
      const field = err.path.join(".");
      fieldErrors[field] = err.message;
    });

    return fieldErrors;
  }

  return {};
}
