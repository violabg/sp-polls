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
import { submitAnswer } from "@/lib/actions/submit-answer";
import { useFormAction } from "@/lib/hooks/use-form-action";
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

  const { state, formAction, isPending } = useFormAction(submitAnswer);
  const typedState = state as Record<string, unknown> | undefined;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    // zodResolver typing is difficult with dynamic schemas; relax here intentionally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({ resolver: zodResolver(schema) as unknown as any });

  const submitAnswers = async (values: FormValues) => {
    const formData = new FormData();
    for (const [questionId, choiceId] of Object.entries(values)) {
      formData.append(
        "answers",
        JSON.stringify({
          question_id: questionId,
          selected_choice: choiceId,
          user_id: userId,
        })
      );
    }

    await formAction(formData);

    // If the action set success state, call onSubmit and reset
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
      {typedState?.success ? (
        <div className="bg-green-100 p-3 border border-green-200 rounded text-green-700 text-sm">
          Risposte inviate con successo!
        </div>
      ) : null}
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
                    onValueChange={(val) => !isPending && field.onChange(val)}
                    value={field.value as string | undefined}
                    disabled={isPending}
                  >
                    {question.choices.map((choice) => (
                      <Field key={choice.id} orientation="horizontal">
                        <RadioGroupItem
                          value={String(choice.id)}
                          id={`${question.id}-${choice.id}`}
                          disabled={isPending}
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

      <Button type="submit" disabled={isPending}>
        {isPending && <FormSpinner isPending size="sm" label="" />}
        {isPending ? "Invio..." : "Invia Risposte"}
      </Button>
    </form>
  );
}
