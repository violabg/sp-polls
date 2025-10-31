import {
  createAnswer,
  getAnswerByUserAndQuestion,
  getQuestionById,
} from "@/lib/mock-data";
import { rateLimitAnswerSubmission } from "@/lib/rate-limit";
import type { ApiResponse, SubmitAnswerResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/questions/[id]/answers
 * Submit an answer for a specific question
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const body = await request.json();
    const { selected_choice, user_id } = body;

    // Validate input
    if (!selected_choice || !user_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimit = await rateLimitAnswerSubmission(user_id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        } as ApiResponse<never>,
        { status: 429 }
      );
    }

    // Check if question exists
    const question = await getQuestionById(questionId);
    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Check for duplicate answer
    const existingAnswer = await getAnswerByUserAndQuestion(
      user_id,
      questionId
    );
    if (existingAnswer) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already answered this question",
        } as ApiResponse<never>,
        { status: 409 }
      );
    }

    // Compute is_correct
    const is_correct = selected_choice === question.correct_choice;

    // Create answer record
    const answer = await createAnswer({
      id: `a-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question_id: questionId,
      user_id,
      selected_choice,
      is_correct,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          answer_id: answer.id,
          is_correct: answer.is_correct,
        },
      } as ApiResponse<SubmitAnswerResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting answer:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
