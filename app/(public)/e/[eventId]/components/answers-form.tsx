"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import type { Question } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface AnswersFormProps {
  questions: Question[];
  userId: string;
  onSubmit?: (answers: Record<string, string>) => void;
}

export function AnswersForm({ questions, userId, onSubmit }: AnswersFormProps) {
  // Build a Zod schema dynamically requiring each question's answer to be a non-empty string
  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const q of questions) {
      shape[q.id] = z.string().nonempty({ message: "Seleziona una risposta" });
    }
    return z.object(shape);
  }, [questions]);

  // Use a stable TypeScript type for form values: a map questionId -> choiceId
  type FormValues = Record<string, string>;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    // zodResolver typing is difficult with dynamic schemas; relax here intentionally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({ resolver: zodResolver(schema) as unknown as any });

  const submitAnswers = async (values: FormValues) => {
    try {
      // Submit each answer
      for (const [questionId, choiceId] of Object.entries(values)) {
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

      // cast to expected external type
      onSubmit?.(values as Record<string, string>);
      alert("Risposte inviate con successo!");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Invio fallito. Riprova più tardi.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitAnswers)} className="space-y-6">
      {questions.map((question) => (
        <Field
          key={question.id}
          className="bg-white p-4 border border-gray-200 rounded-lg"
        >
          <FieldLabel>{question.text}</FieldLabel>
          <FieldContent>
            <Controller
              name={question.id}
              control={control}
              render={({ field }) => (
                <>
                  <RadioGroup
                    onValueChange={(val) => field.onChange(val)}
                    value={field.value as string | undefined}
                  >
                    {question.choices.map((choice) => (
                      <Field key={choice.id} orientation="horizontal">
                        <RadioGroupItem
                          value={String(choice.id)}
                          id={`${question.id}-${choice.id}`}
                        />
                        <FieldLabel
                          className="font-normal"
                          htmlFor={`${question.id}-${choice.id}`}
                        >
                          {choice.text}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                  {(() => {
                    const e = errors[question.id] as unknown as
                      | { message?: string }
                      | undefined;
                    return (
                      <FieldError
                        errors={e ? [{ message: e.message }] : undefined}
                      />
                    );
                  })()}
                </>
              )}
            />
          </FieldContent>
        </Field>
      ))}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}{" "}
        {isSubmitting ? "Invio..." : "Invia Risposte"}
      </Button>
    </form>
  );
}
