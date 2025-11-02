"use server";

import { MOCK_DELAY_MS } from "@/lib/constants";
import { getAllEvents, writeMockFile } from "@/lib/mock-data";
import type { FormActionResponse } from "@/lib/types/forms";
import { italianLabels } from "@/lib/types/italian";
import { sleep } from "@/lib/utils/sleep";
import { redirect } from "next/navigation";
import { z } from "zod";

interface UpdateEventOutput {
  id: string;
  title: string;
  message: string;
}

const statusOptions = ["draft", "published", "archived"] as const;

const updateEventSchema = z.object({
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
 * Server action to update an existing event with redirect on success
 * @param formData - Form data from client
 * @returns Success or error response
 */
export async function updateEventAction(
  formData: FormData
): Promise<FormActionResponse<UpdateEventOutput>> {
  try {
    // Parse form data
    const eventId = formData.get("eventId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;

    // Validate event ID
    if (!eventId) {
      return {
        success: false,
        error: "ID evento mancante",
      };
    }

    // Validate using Zod schema
    const validationResult = updateEventSchema.safeParse({
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

    // Get all events and update the one with matching ID
    const events = await getAllEvents();
    const eventIndex = events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      return {
        success: false,
        error: "Evento non trovato",
      };
    }

    // Update the event
    events[eventIndex] = {
      ...events[eventIndex],
      title: validationResult.data.title,
      description: validationResult.data.description,
      status: validationResult.data.status as
        | "draft"
        | "published"
        | "archived",
    };

    // Write back to mock file
    await writeMockFile("events.json", events);

    console.log(
      `[Server Action] Event updated: ${eventId} with title "${title}"`
    );

    // Redirect on success
    redirect(`/events/${eventId}`);
  } catch (error) {
    // Re-throw Next.js redirect errors
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("[Server Action] Error updating event:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Errore di aggiornamento evento";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
