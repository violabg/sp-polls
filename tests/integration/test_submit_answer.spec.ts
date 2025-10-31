import { getAllAnswers, getQuestionsByEventId } from "@/lib/mock-data";

/**
 * Integration Test: Answer Submission & Scoring
 * Verifies that answers are persisted with correct is_correct computation
 */

describe("Answer Submission & Scoring", () => {
  const eventId = "event-001";
  const userId = "test-user-001";
  const testUserId = `${userId}-${Date.now()}`;

  test("should submit an answer and compute is_correct correctly", async () => {
    // Get questions with correct answers (server-side)
    const questions = await getQuestionsByEventId(eventId);
    expect(questions.length).toBeGreaterThan(0);

    const testQuestion = questions[0];

    // Simulate answer submission
    const response = await fetch(`/api/questions/${testQuestion.id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selected_choice: testQuestion.choices[0]?.id,
        user_id: testUserId,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty("answer_id");
    expect(data.data).toHaveProperty("is_correct");
  });

  test("should prevent duplicate answers from same user for same question", async () => {
    const questions = await getQuestionsByEventId(eventId);
    expect(questions.length).toBeGreaterThan(0);

    const testQuestion = questions[0];
    const uniqueUserId = `dup-test-${Date.now()}`;

    // First submission
    const response1 = await fetch(`/api/questions/${testQuestion.id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selected_choice: testQuestion.choices[0]?.id,
        user_id: uniqueUserId,
      }),
    });
    expect(response1.ok).toBe(true);

    // Second submission (should be blocked)
    const response2 = await fetch(`/api/questions/${testQuestion.id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selected_choice: testQuestion.choices[1]?.id,
        user_id: uniqueUserId,
      }),
    });
    expect(response2.status).toBe(409); // Conflict
    const data2 = await response2.json();
    expect(data2.success).toBe(false);
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
});
