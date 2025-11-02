/**
 * Server Action: Create Event
 * Handles event creation with Zod validation and 2-second delay
 */

"use server";

import { MOCK_DELAY_MS } from "@/lib/constants";
import type { FormActionResponse } from "@/lib/types/forms";
import { sleep } from "@/lib/utils/sleep";
import { ValidationSchemas, getFieldErrors } from "@/lib/utils/validation";
import { z } from "zod";

interface CreateEventOutput {
  id: string;
  title: string;
  message: string;
}

/**
 * Server action to create a new event
 * @param formData - Form data from client
 * @returns Success or error response
 */
export async function createEvent(
  formData: FormData
): Promise<FormActionResponse<CreateEventOutput>> {
  try {
    // Parse form data
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;

    // Validate using Zod schema
    const schema = z.object({
      title: ValidationSchemas.event.shape.title,
      date: ValidationSchemas.event.shape.date,
      description: ValidationSchemas.event.shape.description,
    });

    const validationResult = schema.safeParse({
      title,
      date,
      description,
    });

    if (!validationResult.success) {
      const fieldErrors = getFieldErrors(schema, {
        title,
        date,
        description,
      });

      return {
        success: false,
        error: "Validazione fallita",
        fieldErrors: Object.entries(fieldErrors).reduce((acc, [key, value]) => {
          acc[key] = [value];
          return acc;
        }, {} as Record<string, string[]>),
      };
    }

    // Simulate network delay
    await sleep(MOCK_DELAY_MS);

    // Mock event creation
    const eventId = `evt-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    console.log(
      `[Server Action] Event created: ${eventId} with title "${title}"`
    );

    return {
      success: true,
      data: {
        id: eventId,
        title,
        message: "Evento creato con successo",
      },
    };
  } catch (error) {
    console.error("[Server Action] Error creating event:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Errore di creazione evento";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
