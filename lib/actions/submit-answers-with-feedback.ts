"use server";

import { MOCK_DELAY_MS } from "@/lib/constants";
import {
  getAllAnswers,
  getQuestionsByEventIdWithCorrectChoice,
  writeMockFile,
} from "@/lib/mock-data";
import type { Answer } from "@/lib/types";
import type { FormActionResponse } from "@/lib/types/forms";
import { sleep } from "@/lib/utils/sleep";

interface AnswerFeedback {
  question_id: string;
  selected_choice: string;
  correct_choice: string;
  is_correct: boolean;
  question_text: string;
}

interface SubmitAnswersOutput {
  message: string;
  feedback: AnswerFeedback[];
  total_correct: number;
  total_questions: number;
}

/**
 * Server action to submit all answers for an event and get feedback
 * @param eventId - The event ID
 * @param formData - Form data containing answers
 * @returns Success with feedback or error response
 */
export async function submitAnswersWithFeedback(
  eventId: string,
  _prevState: Record<string, unknown>,
  formData: FormData
): Promise<FormActionResponse<SubmitAnswersOutput>> {
  try {
    // Parse form data
    const userId = formData.get("userId") as string;

    // Validate required fields
    if (!eventId || !userId) {
      return {
        success: false,
        error: "Event ID and User ID are required",
        fieldErrors: {
          submit: ["Missing required fields"],
        },
      };
    }

    // Simulate network delay
    await sleep(MOCK_DELAY_MS);

    // Get questions with correct answers for this event
    const questionsWithAnswers = await getQuestionsByEventIdWithCorrectChoice(
      eventId
    );

    if (questionsWithAnswers.length === 0) {
      return {
        success: false,
        error: "No questions found for this event",
      };
    }

    // Parse and validate answers from form data
    const answersMap = new Map<string, string>();
    const answerEntries = formData.getAll("answers");

    for (const entry of answerEntries) {
      const answer = JSON.parse(entry as string);
      answersMap.set(answer.question_id, answer.selected_choice);
    }

    // Generate feedback and save answers
    const feedback: AnswerFeedback[] = [];
    let correctCount = 0;
    const existingAnswers = await getAllAnswers();

    for (const question of questionsWithAnswers) {
      const selectedChoice = answersMap.get(question.id);

      if (!selectedChoice) {
        return {
          success: false,
          error: `No answer provided for question: ${question.text}`,
        };
      }

      const isCorrect = selectedChoice === question.correct_choice;
      if (isCorrect) correctCount++;

      // Create answer record
      const answer: Answer = {
        id: `ans-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question_id: question.id,
        user_id: userId,
        selected_choice: selectedChoice,
        is_correct: isCorrect,
        created_at: new Date().toISOString(),
      };

      // Save answer to mock data
      existingAnswers.push(answer);

      // Add to feedback
      feedback.push({
        question_id: question.id,
        selected_choice: selectedChoice,
        correct_choice: question.correct_choice,
        is_correct: isCorrect,
        question_text: question.text,
      });
    }

    // Persist all answers at once
    await writeMockFile("answers.json", existingAnswers);

    console.log(
      `[Server Action] Answers submitted for event ${eventId} by user ${userId}`
    );

    return {
      success: true,
      data: {
        message: "Answers submitted successfully",
        feedback,
        total_correct: correctCount,
        total_questions: questionsWithAnswers.length,
      },
    };
  } catch (error) {
    console.error("[Server Action] Error submitting answers:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error submitting answers";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
