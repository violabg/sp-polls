"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { FormSpinner } from "@/components/ui/form-spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitAnswersWithFeedback } from "@/lib/actions/submit-answers-with-feedback";
import type { Question } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface AnswerFeedback {
  question_id: string;
  selected_choice: string;
  correct_choice: string;
  is_correct: boolean;
  question_text: string;
}

interface AnswersFormProps {
  questions: Question[];
  userId: string;
  eventId: string;
  onSubmit?: (answers: Record<string, string>) => void;
}

export function AnswersForm({
  questions,
  userId,
  eventId,
  onSubmit,
}: AnswersFormProps) {
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

  // Use useActionState for handling server action
  const [state, formAction, isPending] = useActionState<
    Record<string, unknown>,
    FormData
  >(
    async (prevState: Record<string, unknown>, formData: FormData) => {
      const result = await submitAnswersWithFeedback(
        eventId,
        prevState,
        formData
      );
      return result as unknown as Record<string, unknown>;
    },
    { success: false, error: null }
  );

  const [, startTransition] = useTransition();

  const typedState = state as
    | (Record<string, unknown> & {
        data?: {
          feedback: AnswerFeedback[];
          total_correct: number;
          total_questions: number;
        };
      })
    | undefined;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    // zodResolver typing is difficult with dynamic schemas; relax here intentionally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({ resolver: zodResolver(schema) as unknown as any });

  const submitAnswers = (values: FormValues) => {
    const formData = new FormData();
    formData.append("userId", userId);
    for (const [questionId, choiceId] of Object.entries(values)) {
      formData.append(
        "answers",
        JSON.stringify({
          question_id: questionId,
          selected_choice: choiceId,
        })
      );
    }

    // Submit via formAction (useActionState) inside startTransition
    startTransition(() => {
      formAction(formData);
    });

    // If the action was successful, call onSubmit and reset
    if (typedState?.success) {
      onSubmit?.(values);
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitAnswers)}
      className="space-y-6"
      aria-busy={isPending}
    >
      {typedState?.error ? (
        <div className="bg-red-100 p-3 border border-red-200 rounded text-red-700 text-sm">
          {String(typedState.error)}
        </div>
      ) : null}

      {/* Feedback Section */}
      {typedState?.success && typedState.data ? (
        <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
          <div className="mb-4">
            <h3 className="font-bold text-blue-900 text-lg">
              Risultato: {typedState.data.total_correct}/
              {typedState.data.total_questions} Corrette
            </h3>
            <p className="text-blue-700 text-sm">
              {Math.round(
                (typedState.data.total_correct /
                  typedState.data.total_questions) *
                  100
              )}
              % Accuratezza
            </p>
          </div>
        </div>
      ) : null}

      {questions.map((question) => {
        // Find feedback for this question
        const questionFeedback = typedState?.success
          ? (typedState.data?.feedback || []).find(
              (f) => f.question_id === question.id
            )
          : null;

        return (
          <Field
            key={question.id}
            className={`p-4 border rounded-lg ${
              questionFeedback
                ? questionFeedback.is_correct
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <FieldLabel>{question.text}</FieldLabel>
              {questionFeedback && (
                <div className="font-semibold text-sm">
                  {questionFeedback.is_correct ? (
                    <span className="text-green-700">✓ Corretta</span>
                  ) : (
                    <span className="text-red-700">✗ Errata</span>
                  )}
                </div>
              )}
            </div>
            <FieldContent>
              <Controller
                name={question.id}
                control={control}
                render={({ field }) => (
                  <>
                    <RadioGroup
                      onValueChange={(val) => !isPending && field.onChange(val)}
                      value={field.value as string | undefined}
                      disabled={isPending || !!questionFeedback}
                    >
                      {question.choices.map((choice) => {
                        const isSelectedChoice =
                          questionFeedback?.selected_choice === choice.id;
                        const isCorrectChoice =
                          questionFeedback?.correct_choice === choice.id;

                        return (
                          <Field
                            key={choice.id}
                            orientation="horizontal"
                            className={
                              isSelectedChoice || isCorrectChoice
                                ? "p-2 rounded"
                                : ""
                            }
                          >
                            <RadioGroupItem
                              value={String(choice.id)}
                              id={`${question.id}-${choice.id}`}
                              disabled={isPending || !!questionFeedback}
                            />
                            <FieldLabel
                              className={`font-normal ${
                                isSelectedChoice && !isCorrectChoice
                                  ? "text-red-700 font-semibold"
                                  : isCorrectChoice
                                  ? "text-green-700 font-semibold"
                                  : ""
                              }`}
                              htmlFor={`${question.id}-${choice.id}`}
                            >
                              {choice.text}
                              {isCorrectChoice && !isSelectedChoice && (
                                <span className="ml-2 text-green-700">
                                  (Risposta Corretta)
                                </span>
                              )}
                            </FieldLabel>
                          </Field>
                        );
                      })}
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
        );
      })}

      <Button type="submit" disabled={isPending || !!typedState?.success}>
        {isPending && <FormSpinner isPending size="sm" label="" />}
        {isPending ? "Invio..." : "Invia Risposte"}
      </Button>
    </form>
  );
}
