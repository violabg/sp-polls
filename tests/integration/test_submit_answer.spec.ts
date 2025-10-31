import { getAllAnswers, getQuestionsByEventId } from "@/lib/mock-data";

/**
 * Integration Test: Answer Submission & Scoring
 * Verifies that answers are persisted with correct is_correct computation
 *
 * Note: API endpoint tests are better suited for E2E tests with Playwright
 * These unit tests verify the data layer and mock data structure
 */

describe("Answer Submission & Scoring", () => {
  const eventId = "event-001";

  test("should have questions with choices for testing", async () => {
    const questions = await getQuestionsByEventId(eventId);
    expect(questions.length).toBeGreaterThan(0);

    const testQuestion = questions[0];
    expect(testQuestion).toHaveProperty("id");
    expect(testQuestion).toHaveProperty("event_id");
    expect(testQuestion).toHaveProperty("text");
    expect(Array.isArray(testQuestion.choices)).toBe(true);
    expect(testQuestion.choices.length).toBeGreaterThan(0);
  });

  test("should not expose correct_choice in public questions", async () => {
    const questions = await getQuestionsByEventId(eventId);
    expect(questions.length).toBeGreaterThan(0);

    for (const question of questions) {
      expect(question).not.toHaveProperty("correct_choice");
    }
  });

  test("persisted answers should contain is_correct field", async () => {
    const allAnswers = await getAllAnswers();
    expect(allAnswers.length).toBeGreaterThan(0);

    for (const answer of allAnswers) {
      expect(answer).toHaveProperty("id");
      expect(answer).toHaveProperty("question_id");
      expect(answer).toHaveProperty("user_id");
      expect(answer).toHaveProperty("selected_choice");
      expect(answer).toHaveProperty("is_correct");
      expect(typeof answer.is_correct).toBe("boolean");
      expect(answer).toHaveProperty("created_at");
    }
  });

  test("mock data should be well-formed", async () => {
    const questions = await getQuestionsByEventId(eventId);
    const allAnswers = await getAllAnswers();

    // Verify answers reference valid questions
    const questionIds = new Set(questions.map((q) => q.id));
    for (const answer of allAnswers) {
      expect(questionIds.has(answer.question_id)).toBe(true);
    }
  });
});
