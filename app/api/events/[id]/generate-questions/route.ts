import { logAiGeneration } from "@/lib/ai-audit";
import {
  createQuestions,
  getEventById,
  getQuestionsByEventIdWithCorrectChoice,
} from "@/lib/mock-data";
import { rateLimitAiGeneration } from "@/lib/rate-limit";
import type {
  ApiResponse,
  GenerateQuestionsResponse,
  Question,
} from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/events/[id]/generate-questions
 * Generate questions for an event using AI
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    // TODO: Extract userId from session/auth
    const userId = "admin-001";

    // Rate limiting
    const rateLimit = await rateLimitAiGeneration(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Maximum 5 generations per hour.",
        } as ApiResponse<never>,
        { status: 429 }
      );
    }

    // Check if event exists
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Check if questions already exist
    const existingQuestions = await getQuestionsByEventIdWithCorrectChoice(
      eventId
    );
    if (existingQuestions.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Questions already exist for this event",
        } as ApiResponse<never>,
        { status: 409 }
      );
    }

    // Generate mock questions (replace with AI SDK in production)
    const mockQuestions = generateMockQuestions(eventId);

    // Log AI generation for audit
    const auditLog = await logAiGeneration({
      event_id: eventId,
      prompt: `Generate 4 multiple-choice questions for event: ${event.title}`,
      model: "gpt-4o-mock",
      response_data: mockQuestions,
    });

    // Create questions
    await createQuestions(mockQuestions);

    // Map to public response (without correct_choice)
    const publicQuestions: Question[] = mockQuestions.map((q) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { correct_choice, ...publicQ } = q;
      return publicQ as Question;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          questions: publicQuestions,
          audit_id: auditLog.id,
        },
      } as ApiResponse<GenerateQuestionsResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * Generate 4 mock questions for demo purposes
 * Replace with actual AI SDK call in production
 */
function generateMockQuestions(eventId: string) {
  return [
    {
      id: `q-${Date.now()}-1`,
      event_id: eventId,
      text: "What is the primary goal of server-side rendering?",
      choices: [
        { id: "c1", text: "Improve SEO and initial load performance" },
        { id: "c2", text: "Reduce server costs" },
        { id: "c3", text: "Simplify CSS styling" },
        { id: "c4", text: "Increase client-side processing" },
      ],
      correct_choice: "c1",
      generated_by_ai: true,
      created_at: new Date().toISOString(),
    },
    {
      id: `q-${Date.now()}-2`,
      event_id: eventId,
      text: "Which of the following is a benefit of Next.js App Router?",
      choices: [
        { id: "c1", text: "File-based routing with simpler configuration" },
        { id: "c2", text: "Automatic database connection management" },
        { id: "c3", text: "Built-in authentication for all users" },
        { id: "c4", text: "Eliminates the need for frontend testing" },
      ],
      correct_choice: "c1",
      generated_by_ai: true,
      created_at: new Date().toISOString(),
    },
    {
      id: `q-${Date.now()}-3`,
      event_id: eventId,
      text: "What should be kept server-side and never exposed to clients?",
      choices: [
        { id: "c1", text: "API keys and secrets" },
        { id: "c2", text: "Event data and titles" },
        { id: "c3", text: "User preferences" },
        { id: "c4", text: "Question text" },
      ],
      correct_choice: "c1",
      generated_by_ai: true,
      created_at: new Date().toISOString(),
    },
    {
      id: `q-${Date.now()}-4`,
      event_id: eventId,
      text: "How should rate limiting be implemented for production?",
      choices: [
        { id: "c1", text: "Redis or specialized rate-limiting service" },
        { id: "c2", text: "In-memory JavaScript objects" },
        { id: "c3", text: "Client-side validation only" },
        { id: "c4", text: "No rate limiting needed" },
      ],
      correct_choice: "c1",
      generated_by_ai: true,
      created_at: new Date().toISOString(),
    },
  ];
}
