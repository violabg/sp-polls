import { getQuestionsByEventId } from "@/lib/mock-data";

/**
 * Contract Test: Public Question Payload Validation
 * Ensures that correct_choice is never returned in client-facing payloads
 */

describe("Question Payload Contract", () => {
  test("public question payload should NOT include correct_choice", async () => {
    const eventId = "event-001";
    const questions = await getQuestionsByEventId(eventId);

    // Assert questions exist
    expect(questions.length).toBeGreaterThan(0);

    // Check each question
    for (const question of questions) {
      // Should NOT have correct_choice property
      expect(question).not.toHaveProperty("correct_choice");

      // Should have required public properties
      expect(question).toHaveProperty("id");
      expect(question).toHaveProperty("event_id");
      expect(question).toHaveProperty("text");
      expect(question).toHaveProperty("choices");

      // Choices should be valid
      expect(Array.isArray(question.choices)).toBe(true);
      expect(question.choices.length).toBeGreaterThan(0);

      for (const choice of question.choices) {
        expect(choice).toHaveProperty("id");
        expect(choice).toHaveProperty("text");
      }
    }
  });

  test("question payload JSON should not contain correct_choice string", async () => {
    const eventId = "event-001";
    const questions = await getQuestionsByEventId(eventId);

    for (const question of questions) {
      const jsonStr = JSON.stringify(question);
      expect(jsonStr).not.toMatch(/correct_choice/);
    }
  });
});
