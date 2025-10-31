"use client";

import type { Question } from "@/lib/types";
import { useState } from "react";

interface AnswersFormProps {
  questions: Question[];
  userId: string;
  onSubmit?: (answers: Record<string, string>) => void;
}

export function AnswersForm({ questions, userId, onSubmit }: AnswersFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChoiceChange = (questionId: string, choiceId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit each answer
      for (const [questionId, choiceId] of Object.entries(answers)) {
        const response = await fetch(`/api/questions/${questionId}/answers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: questionId,
            selected_choice: choiceId,
            user_id: userId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to submit answer for question ${questionId}`);
        }
      }

      onSubmit?.(answers);
      alert("Answers submitted successfully!");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question) => (
        <div
          key={question.id}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <h3 className="mb-3 font-semibold text-gray-900">{question.text}</h3>
          <div className="space-y-2">
            {question.choices.map((choice) => (
              <label key={choice.id} className="flex items-center">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={choice.id}
                  checked={answers[question.id] === choice.id}
                  onChange={() => handleChoiceChange(question.id, choice.id)}
                  className="mr-3"
                />
                <span className="text-gray-700">{choice.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={!allAnswered || loading}
        className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Answers"}
      </button>
    </form>
  );
}
