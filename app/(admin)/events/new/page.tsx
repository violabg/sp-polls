"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

  const onSubmit = (data: EventFormData) => {
    console.log("Create event", {
      ...data,
      description: data.description ?? "",
    });
    router.push("/events");
  };

  return (
    <div className="mx-auto p-4 container">
      <h1 className="mb-4 font-bold text-2xl">Create New Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldSet>
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Enter event title"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Enter event description (optional)"
                className="min-h-[100px] resize-none"
                {...register("description")}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </Field>
            <Field data-invalid={!!errors.status}>
              <FieldLabel>Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger aria-invalid={!!errors.status}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
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
            <Button type="submit">Create Event</Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
