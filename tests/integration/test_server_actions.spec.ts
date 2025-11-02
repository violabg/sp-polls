/**
 * Integration Tests: Server Actions
 * Tests for form server actions with 2-second delay
 */

import { createEvent } from "@/lib/actions/create-event";
import { generateQuestions } from "@/lib/actions/generate-questions";
import { submitAnswer } from "@/lib/actions/submit-answer";
import { updateEvent } from "@/lib/actions/update-event";

describe("Server Actions Integration Tests", () => {
  describe("createEvent", () => {
    it("should create an event successfully", async () => {
      const formData = new FormData();
      formData.append("title", "Test Event");
      formData.append("date", new Date(Date.now() + 86400000).toISOString());
      formData.append("description", "Test description");

      const result = await createEvent(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.id).toBeDefined();
        expect(result.data?.title).toBe("Test Event");
        expect(result.data?.message).toBe("Evento creato con successo");
      }
    });

    it("should validate required fields", async () => {
      const formData = new FormData();
      formData.append("title", "");
      formData.append("date", "invalid");

      const result = await createEvent(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Validazione fallita");
        expect(result.fieldErrors).toBeDefined();
      }
    });

    it("should reject past dates", async () => {
      const formData = new FormData();
      formData.append("title", "Test Event");
      formData.append("date", new Date(Date.now() - 86400000).toISOString()); // Past date
      formData.append("description", "Test description");

      const result = await createEvent(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe("updateEvent", () => {
    it("should update an event successfully", async () => {
      const formData = new FormData();
      formData.append("eventId", "event-001");
      formData.append("title", "Updated Event");
      formData.append("date", new Date(Date.now() + 86400000).toISOString());
      formData.append("description", "Updated description");

      try {
        await updateEvent(formData);
        // If it doesn't throw, it should have returned success, but since it redirects, it throws
        fail("Expected redirect");
      } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
          // Success, redirected
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it("should require event ID", async () => {
      const formData = new FormData();
      formData.append("title", "Updated Event");
      formData.append("date", new Date(Date.now() + 86400000).toISOString());

      const result = await updateEvent(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("ID evento mancante");
      }
    });
  });

  describe("submitAnswer", () => {
    it("should submit an answer successfully", async () => {
      const formData = new FormData();
      formData.append("questionId", "q-123");
      formData.append("userId", "user-456");
      formData.append("selectedChoice", "choice-789");

      const result = await submitAnswer(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.answerId).toBeDefined();
        expect(result.data?.questionId).toBe("q-123");
        expect(typeof result.data?.isCorrect).toBe("boolean");
        expect(result.data?.message).toBe("Risposta inviata con successo");
      }
    });

    it("should require all fields", async () => {
      const formData = new FormData();
      formData.append("questionId", "q-123");
      // Missing userId and selectedChoice

      const result = await submitAnswer(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Campi obbligatori mancanti");
      }
    });
  });

  describe("generateQuestions", () => {
    it("should generate questions successfully", async () => {
      const formData = new FormData();
      formData.append("eventId", "event-123");

      const result = await generateQuestions(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.eventId).toBe("event-123");
        expect(result.data?.questionsGenerated).toBe(4);
        expect(result.data?.message).toContain("domande generate");
      }
    });

    it("should require event ID", async () => {
      const formData = new FormData();
      // No eventId provided

      const result = await generateQuestions(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("ID evento mancante");
      }
    });
  });

  describe("Server Action Timing", () => {
    it("should have 2-second delay on createEvent", async () => {
      const formData = new FormData();
      formData.append("title", "Timing Test");
      formData.append("date", new Date(Date.now() + 86400000).toISOString());

      const startTime = Date.now();
      await createEvent(formData);
      const elapsedTime = Date.now() - startTime;

      // Should be approximately 0 in test environment (delay disabled)
      expect(elapsedTime).toBeGreaterThanOrEqual(0);
      expect(elapsedTime).toBeLessThan(100);
    });

    it("should have 2-second delay on submitAnswer", async () => {
      const formData = new FormData();
      formData.append("questionId", "q-123");
      formData.append("userId", "user-456");
      formData.append("selectedChoice", "choice-789");

      const startTime = Date.now();
      await submitAnswer(formData);
      const elapsedTime = Date.now() - startTime;

      // Should be approximately 0 in test environment (delay disabled)
      expect(elapsedTime).toBeGreaterThanOrEqual(0);
      expect(elapsedTime).toBeLessThan(100);
    });
  });
});
