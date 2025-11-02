"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getEventById, getQuestionsByEventId } from "@/lib/mock-data";
import { AnswersForm } from "./components/answers-form";
import { LoginPrompt } from "./components/login-prompt";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = await params;
  const [event, questions, user] = await Promise.all([
    getEventById(eventId),
    getQuestionsByEventId(eventId),
    getCurrentUser(),
  ]);

  if (!event) {
    return (
      <div className="mx-auto py-8 container">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg text-center">
          <h1 className="font-bold text-red-900 text-2xl">
            Evento Non Trovato
          </h1>
          <p className="mt-2 text-red-700">
            L&apos;evento che stai cercando non esiste.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 container">
      <div className="max-w-2xl">
        {/* Event Header */}
        <Card className="mt-6 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription>ID Evento: {event.id}</CardDescription>
          </CardHeader>
          <CardContent>{event.description}</CardContent>
        </Card>

        {/* Login Prompt or Answers Form */}
        {!user ? (
          <LoginPrompt />
        ) : (
          <Card className="mt-6 mb-8">
            <CardHeader>
              <CardTitle className="text-xl">
                Domande ({questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <AnswersForm
                  questions={questions}
                  userId={user.id}
                  eventId={eventId}
                />
              ) : (
                <div className="bg-yellow-50 p-6 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700">
                    Nessuna domanda disponibile per questo evento ancora.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
