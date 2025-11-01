import { isAdmin } from "@/lib/auth";
import {
  getAllAnswers,
  getEventById,
  getQuestionsByEventIdWithCorrectChoice,
} from "@/lib/mock-data";
import type { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/events/[id]/answers
 * Export answers as CSV (optionally anonymized)
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
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const anonymized = searchParams.get("anonymized") === "true";

    // Get event and related data
    const [event, questions, allAnswers] = await Promise.all([
      getEventById(eventId),
      getQuestionsByEventIdWithCorrectChoice(eventId),
      getAllAnswers(),
    ]);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" } as ApiResponse<never>,
        { status: 404 }
      );
    }

    if (format !== "csv") {
      return NextResponse.json(
        {
          success: false,
          error: "Only CSV format is supported",
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Filter answers for this event
    const questionIds = new Set(questions.map((q) => q.id));
    const eventAnswers = allAnswers.filter((a) =>
      questionIds.has(a.question_id)
    );

    // Build CSV
    const csvHeader = anonymized
      ? [
          "Answer ID",
          "Question Text",
          "Selected Choice",
          "Is Correct",
          "Submitted At",
        ]
      : [
          "Answer ID",
          "User ID",
          "Question Text",
          "Selected Choice",
          "Is Correct",
          "Submitted At",
        ];

    const csvRows = eventAnswers.map((answer) => {
      const question = questions.find((q) => q.id === answer.question_id);
      const choice = question?.choices.find(
        (c) => c.id === answer.selected_choice
      );

      return anonymized
        ? [
            answer.id,
            question?.text || "Unknown",
            choice?.text || "Unknown",
            answer.is_correct ? "Yes" : "No",
            answer.created_at,
          ]
        : [
            answer.id,
            answer.user_id,
            question?.text || "Unknown",
            choice?.text || "Unknown",
            answer.is_correct ? "Yes" : "No",
            answer.created_at,
          ];
    });

    const csv = [
      csvHeader.join(","),
      ...csvRows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="event-${eventId}-answers.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting answers:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
