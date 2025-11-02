"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { FormSpinner } from "@/components/ui/form-spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Event } from "@/lib/types";
import { italianLabels } from "@/lib/types/italian";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateEventAction } from "./actions";

const eventSchema = z.object({
  title: z
    .string()
    .min(1, italianLabels.required_field)
    .max(255, italianLabels.max_length(255)),
  description: z.string().max(1000, italianLabels.max_length(1000)).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface ServerState {
  success?: boolean;
  error?: string;
}

interface EditFormProps {
  event: Event;
}

export function EditForm({ event }: EditFormProps) {
  const [state, formAction] = useActionState<ServerState, FormData>(
    async (_prevState: ServerState, formData: FormData) => {
      return updateEventAction(formData) as Promise<ServerState>;
    },
    {}
  );

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
    },
  });

  const onSubmit = (data: EventFormData) => {
    const formData = new FormData();
    formData.append("eventId", event.id);
    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isPending}>
      {state?.error ? (
        <div className="bg-red-100 mb-4 p-3 border border-red-200 rounded text-red-700 text-sm">
          {String(state.error)}
        </div>
      ) : null}
      <FieldSet disabled={isPending}>
        <FieldGroup>
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="title">Nome Evento</FieldLabel>
            <Input
              id="title"
              placeholder="Inserisci il nome dell'evento"
              aria-invalid={!!errors.title}
              disabled={isPending}
              {...register("title")}
            />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>
          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="description">Descrizione</FieldLabel>
            <Textarea
              id="description"
              placeholder="Inserisci la descrizione dell'evento (facoltativo)"
              className="min-h-[100px] resize-none"
              disabled={isPending}
              {...register("description")}
            />
            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>
          <input type="hidden" name="eventId" value={event.id} />
          <Button type="submit" disabled={isPending}>
            {isPending && <FormSpinner isPending size="sm" label="" />}
            {isPending ? italianLabels.saving : italianLabels.save}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
