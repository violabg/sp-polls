"use server";

import { MOCK_DELAY_MS } from "@/lib/constants";
import { createEvent as createEventInMock } from "@/lib/mock-data";
import type { FormActionResponse } from "@/lib/types/forms";
import { italianLabels } from "@/lib/types/italian";
import { sleep } from "@/lib/utils/sleep";
import { redirect } from "next/navigation";
import { z } from "zod";

interface CreateEventOutput {
  id: string;
  title: string;
  message: string;
}

const statusOptions = ["draft", "published", "archived"] as const;

const createEventSchema = z.object({
  title: z
    .string()
    .min(1, italianLabels.required_field)
    .max(255, italianLabels.max_length(255)),
  description: z
    .string()
    .max(1000, italianLabels.max_length(1000))
    .optional()
    .default(""),
  status: z.enum(statusOptions, { message: italianLabels.invalid_format }),
});

/**
 * Server action to create a new event with redirect on success
 * @param formData - Form data from client
 * @returns Success or error response
 */
export async function createEventAction(
  formData: FormData
): Promise<FormActionResponse<CreateEventOutput>> {
  try {
    // Parse form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;

    // Validate using Zod schema
    const validationResult = createEventSchema.safeParse({
      title,
      description,
      status,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const error of validationResult.error.issues) {
        const field = error.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      }

      return {
        success: false,
        error: italianLabels.error,
        fieldErrors,
      };
    }

    // Simulate network delay
    await sleep(MOCK_DELAY_MS);

    // Generate event ID
    const eventId = `event-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create the event in mock data
    const newEvent = {
      id: eventId,
      title: validationResult.data.title,
      description: validationResult.data.description,
      qr_code_url: ``,
      created_by: "user-admin-1",
      status: validationResult.data.status as
        | "draft"
        | "published"
        | "archived",
      created_at: new Date().toISOString(),
    };

    await createEventInMock(newEvent);

    console.log(
      `[Server Action] Event created: ${eventId} with title "${title}"`
    );

    // Redirect on success
    redirect(`/events/${eventId}`);
  } catch (error) {
    // Re-throw Next.js redirect errors
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("[Server Action] Error creating event:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Errore di creazione evento";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
