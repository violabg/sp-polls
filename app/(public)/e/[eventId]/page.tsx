"use server";

import { getCurrentUser } from "@/lib/auth";
import { getEventById, getQuestionsByEventId } from "@/lib/mock-data";
import { AnswersForm } from "./components/answers-form";
import { LoginPrompt } from "./components/login-prompt";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const [event, questions, user] = await Promise.all([
    getEventById(params.eventId),
    getQuestionsByEventId(params.eventId),
    getCurrentUser(),
  ]);

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-900">Event Not Found</h1>
          <p className="mt-2 text-red-700">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl">
        {/* Event Header */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <p className="mt-2 text-gray-600">{event.description}</p>
          <p className="mt-4 text-sm text-gray-500">Event ID: {event.id}</p>
        </div>

        {/* Login Prompt or Answers Form */}
        {!user ? (
          <LoginPrompt />
        ) : (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Questions ({questions.length})
            </h2>
            {questions.length > 0 ? (
              <AnswersForm questions={questions} userId={user.id} />
            ) : (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
                <p className="text-yellow-700">
                  No questions available for this event yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
