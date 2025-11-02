/**
 * Server Action: Submit Answer
 * Handles answer submission with validation and 2-second delay
 */

"use server";

import { MOCK_DELAY_MS } from "@/lib/constants";
import type { FormActionResponse } from "@/lib/types/forms";
import { sleep } from "@/lib/utils/sleep";

interface SubmitAnswerOutput {
  answerId: string;
  questionId: string;
  isCorrect: boolean;
  message: string;
}

/**
 * Server action to submit an answer to a question
 * @param formData - Form data from client
 * @returns Success or error response
 */
export async function submitAnswer(
  formData: FormData
): Promise<FormActionResponse<SubmitAnswerOutput>> {
  try {
    // Parse form data
    const questionId = formData.get("questionId") as string;
    const userId = formData.get("userId") as string;
    const selectedChoice = formData.get("selectedChoice") as string;

    // Validate required fields
    if (!questionId || !userId || !selectedChoice) {
      return {
        success: false,
        error: "Campi obbligatori mancanti",
        fieldErrors: {
          answer: ["Selezionare una risposta"],
        },
      };
    }

    // Simulate network delay
    await sleep(MOCK_DELAY_MS);

    // Mock: randomly determine if answer is correct
    const isCorrect = Math.random() > 0.5;

    const answerId = `ans-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    console.log(
      `[Server Action] Answer submitted: ${answerId} for question ${questionId}`
    );

    return {
      success: true,
      data: {
        answerId,
        questionId,
        isCorrect,
        message: "Risposta inviata con successo",
      },
    };
  } catch (error) {
    console.error("[Server Action] Error submitting answer:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Errore di invio risposta";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
