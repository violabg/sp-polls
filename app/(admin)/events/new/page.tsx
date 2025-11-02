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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/lib/actions/create-event";
import { useFormAction } from "@/lib/hooks/use-form-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const statusOptions = ["draft", "published", "archived"] as const;

const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  status: z.enum(statusOptions),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function NewEventPage() {
  const router = useRouter();
  const { state, formAction, isPending } = useFormAction(createEvent);
  const typedState = state as Record<string, unknown> | undefined;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
    },
  });

  // Handle successful form submission
  useEffect(() => {
    if (typedState?.success) {
      router.push("/events");
    }
  }, [typedState?.success, router]);

  const onSubmit = async (data: EventFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    formData.append("status", data.status);

    // Call formAction directly - it handles its own pending state
    await formAction(formData);
  };

  return (
    <div className="mx-auto p-4 container">
      <h1 className="mb-4 font-bold text-2xl">Crea Nuovo Evento</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isPending}>
        {typedState?.error ? (
          <div className="bg-red-100 mb-4 p-3 border border-red-200 rounded text-red-700 text-sm">
            {String(typedState.error)}
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
            <Field data-invalid={!!errors.status}>
              <FieldLabel>Stato</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) =>
                      !isPending && field.onChange(value)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.status}
                      disabled={isPending}
                    >
                      <SelectValue placeholder="Seleziona lo stato" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === "draft"
                            ? "Bozza"
                            : option === "published"
                            ? "Pubblicato"
                            : "Archiviato"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <FieldError>{errors.status.message}</FieldError>
              )}
            </Field>
            <Button type="submit" disabled={isPending}>
              {isPending && <FormSpinner isPending size="sm" label="" />}
              {isPending ? "Caricamento..." : "Crea Evento"}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
