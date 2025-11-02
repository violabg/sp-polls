/**
 * Server Action: Generate Questions
 * Handles AI question generation with 2-second delay
 */

"use server";

import { MOCK_DELAY_MS } from "@/lib/constants";
import type { FormActionResponse } from "@/lib/types/forms";
import { sleep } from "@/lib/utils/sleep";

interface GeneratedQuestion {
  id: string;
  text: string;
  choices: Array<{ id: string; text: string }>;
  correct_choice: string;
}

interface GenerateQuestionsOutput {
  eventId: string;
  questionsGenerated: number;
  message: string;
}

/**
 * Server action to generate questions for an event
 * @param formData - Form data from client
 * @returns Success or error response
 */
export async function generateQuestions(
  formData: FormData
): Promise<FormActionResponse<GenerateQuestionsOutput>> {
  try {
    // Parse form data
    const eventId = formData.get("eventId") as string;

    if (!eventId) {
      return {
        success: false,
        error: "ID evento mancante",
      };
    }

    // Simulate network delay
    await sleep(MOCK_DELAY_MS);

    // Mock: generate 4 questions
    const questions: GeneratedQuestion[] = [
      {
        id: `q-${Date.now()}-1`,
        text: "Qual è il vantaggio principale di Next.js?",
        choices: [
          { id: "c1", text: "Routing basato su file" },
          { id: "c2", text: "API Keys automatiche" },
          { id: "c3", text: "Autenticazione integrata" },
          { id: "c4", text: "Eliminazione del testing frontend" },
        ],
        correct_choice: "c1",
      },
      {
        id: `q-${Date.now()}-2`,
        text: "Cosa dovrebbe essere mantenuto server-side?",
        choices: [
          { id: "c1", text: "API keys e secrets" },
          { id: "c2", text: "Dati evento" },
          { id: "c3", text: "Titoli" },
          { id: "c4", text: "Preferenze utente" },
        ],
        correct_choice: "c1",
      },
      {
        id: `q-${Date.now()}-3`,
        text: "Come implementare rate limiting in produzione?",
        choices: [
          { id: "c1", text: "Redis o servizio specializzato" },
          { id: "c2", text: "Oggetti JavaScript in memoria" },
          { id: "c3", text: "Validazione lato client" },
          { id: "c4", text: "Nessun rate limiting necessario" },
        ],
        correct_choice: "c1",
      },
      {
        id: `q-${Date.now()}-4`,
        text: "Qual è il miglior approccio per le server actions?",
        choices: [
          { id: "c1", text: "Validazione lato server sempre" },
          { id: "c2", text: "Solo validazione lato client" },
          { id: "c3", text: "Nessuna validazione" },
          { id: "c4", text: "Fidarsi dei dati non validati" },
        ],
        correct_choice: "c1",
      },
    ];

    console.log(
      `[Server Action] Generated ${questions.length} questions for event ${eventId}`
    );

    return {
      success: true,
      data: {
        eventId,
        questionsGenerated: questions.length,
        message: `${questions.length} domande generate con successo`,
      },
    };
  } catch (error) {
    console.error("[Server Action] Error generating questions:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Errore nella generazione domande";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
