/**
 * Server Action: Update Event (Deprecated)
 * This action is kept for backwards compatibility.
 * Use the action from app/(admin)/events/[id]/edit/actions.ts instead.
 */

"use server";

// Re-export from the new location
export { updateEventAction as updateEvent } from "@/app/(admin)/events/[id]/edit/actions";
