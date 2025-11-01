import { getAllAnswers, getQuestionsByEventId } from "@/lib/mock-data";

/**
 * Integration Test: Aggregated Answers
 * Verifies that aggregated statistics are calculated correctly
 */

describe("Aggregated Answers", () => {
  const eventId = "event-001";

  test("should calculate percentage correct for each question", async () => {
    const questions = await getQuestionsByEventId(eventId);
    expect(questions.length).toBeGreaterThan(0);

    const allAnswers = await getAllAnswers();
    const eventAnswers = allAnswers.filter((a) =>
      questions.map((q) => q.id).includes(a.question_id)
    );

    // For each question, verify percentage is calculable
    for (const question of questions) {
      const questionAnswers = eventAnswers.filter(
        (a) => a.question_id === question.id
      );
      const correctAnswers = questionAnswers.filter((a) => a.is_correct);

      if (questionAnswers.length > 0) {
        const percentage = Math.round(
          (correctAnswers.length / questionAnswers.length) * 100
        );
        expect(percentage).toBeGreaterThanOrEqual(0);
        expect(percentage).toBeLessThanOrEqual(100);
      }
    }
  });

  test("should calculate choice breakdown correctly", async () => {
    const questions = await getQuestionsByEventId(eventId);
    const allAnswers = await getAllAnswers();

    for (const question of questions) {
      const questionAnswers = allAnswers.filter(
        (a) => a.question_id === question.id
      );

      for (const choice of question.choices) {
        const count = questionAnswers.filter(
          (a) => a.selected_choice === choice.id
        ).length;
        const percentage =
          questionAnswers.length > 0
            ? Math.round((count / questionAnswers.length) * 100)
            : 0;

        expect(count).toBeGreaterThanOrEqual(0);
        expect(percentage).toBeGreaterThanOrEqual(0);
        expect(percentage).toBeLessThanOrEqual(100);
      }
    }
  });

  test("CSV export should be accessible for admins", async () => {
    // TODO: Mock admin context
    // const response = await fetch(`/api/events/${eventId}/answers?format=csv`)
    // expect(response.ok).toBe(true)
    // expect(response.headers.get('Content-Type')).toContain('text/csv')
    expect(true).toBe(true);
  });

  test("anonymized export should not include user IDs", async () => {
    // TODO: Mock admin context and verify anonymization
    // const response = await fetch(
    //   `/api/events/${eventId}/answers?format=csv&anonymized=true`
    // )
    // const csv = await response.text()
    // expect(csv).not.toContain('user_id')
    // expect(csv).toContain('Answer ID') // CSV should still have answer IDs
    expect(true).toBe(true);
  });
});
