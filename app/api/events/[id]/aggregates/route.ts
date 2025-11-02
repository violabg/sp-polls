import { isAdmin } from "@/lib/auth";
import {
  getAllAnswers,
  getAllUsers,
  getEventById,
  getQuestionsByEventId,
} from "@/lib/mock-data";
import type {
  Answer,
  ApiResponse,
  EventUserAggregatesResponse,
  UserAggregate,
  UserAnswer,
} from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/events/[id]/aggregates
 * Get event answer aggregates grouped by user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } as ApiResponse<never>,
        { status: 403 }
      );
    }

    const { id: eventId } = await params;

    // Get event
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Get questions for this event
    const questions = await getQuestionsByEventId(eventId);

    // Get all answers and filter for this event's questions
    const allAnswers = await getAllAnswers();
    const questionIds = new Set(questions.map((q) => q.id));
    const eventAnswers = allAnswers.filter((a) =>
      questionIds.has(a.question_id)
    );

    // Get all users
    const allUsers = await getAllUsers();

    // Group answers by user and deduplicate by question (keep latest)
    const answersByUser = new Map<string, Map<string, Answer>>();
    for (const answer of eventAnswers) {
      if (!answersByUser.has(answer.user_id)) {
        answersByUser.set(answer.user_id, new Map());
      }
      const userAnswers = answersByUser.get(answer.user_id)!;

      // Keep the latest answer for each question
      const existing = userAnswers.get(answer.question_id);
      if (
        !existing ||
        new Date(answer.created_at) > new Date(existing.created_at)
      ) {
        userAnswers.set(answer.question_id, answer);
      }
    }

    // Build aggregates
    const aggregates: UserAggregate[] = [];
    for (const [userId, userAnswersMap] of answersByUser) {
      const user = allUsers.find((u) => u.id === userId);
      if (!user) continue; // Skip if user not found

      const userAnswersFormatted: UserAnswer[] = Array.from(
        userAnswersMap.values()
      ).map((answer) => {
        const question = questions.find((q) => q.id === answer.question_id);
        return {
          question_id: answer.question_id,
          question_text: question?.text || "Unknown Question",
          selected_choice: answer.selected_choice,
          is_correct: answer.is_correct,
        };
      });

      aggregates.push({
        user,
        answers: userAnswersFormatted,
      });
    }

    // Sort aggregates by user name
    aggregates.sort((a, b) => a.user.name.localeCompare(b.user.name));

    const response: EventUserAggregatesResponse = {
      event,
      aggregates,
    };

    return NextResponse.json({
      success: true,
      data: response,
    } as ApiResponse<EventUserAggregatesResponse>);
  } catch (error) {
    console.error("Error getting event aggregates:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
