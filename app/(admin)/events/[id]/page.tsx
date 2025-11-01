"use server";

import { isAdmin } from "@/lib/auth";
import {
  getEventById,
  getQuestionsByEventIdWithCorrectChoice,
} from "@/lib/mock-data";
import Link from "next/link";

export default async function AdminEventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const [adminCheck, event, questions] = await Promise.all([
    isAdmin(),
    getEventById(id),
    getQuestionsByEventIdWithCorrectChoice(id),
  ]);

  if (!adminCheck) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-900">Access Denied</h1>
          <p className="mt-2 text-red-700">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

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
      {/* Back Link */}
      <Link href="/events" className="text-blue-600 hover:text-blue-800">
        &larr; Back to Events
      </Link>

      {/* Event Header */}
      <div className="mb-8 mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
        <p className="mt-2 text-gray-600">{event.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Status:</span>
            <span
              className={`ml-2 rounded-full px-3 py-1 ${
                event.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {event.status}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">QR Code:</span>
            <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-gray-700">
              {event.qr_code_url}
            </code>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Questions ({questions.length}/4)
          </h2>
          <form action="/admin/events/[id]/generate-questions" method="POST">
            <button
              type="submit"
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Generate Questions
            </button>
          </form>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <p className="text-yellow-700">
              No questions yet. Generate AI questions to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, idx) => (
              <div
                key={question.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <h3 className="font-semibold text-gray-900">
                  {idx + 1}. {question.text}
                </h3>
                <div className="mt-3 space-y-2">
                  {question.choices.map((choice) => (
                    <div key={choice.id} className="flex items-center">
                      <input
                        type="radio"
                        disabled
                        checked={choice.id === question.correct_choice}
                        className="mr-2"
                      />
                      <span className="text-gray-700">{choice.text}</span>
                      {choice.id === question.correct_choice && (
                        <span className="ml-2 rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Admin Actions</h3>
        <div className="space-y-2">
          <Link
            href={`/admin/events/${event.id}/aggregates`}
            className="block rounded-md bg-blue-100 px-4 py-2 text-blue-600 hover:bg-blue-200"
          >
            View Aggregated Answers
          </Link>
          <Link
            href={`/admin/events/${event.id}/edit`}
            className="block rounded-md bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Edit Event
          </Link>
        </div>
      </div>
    </div>
  );
}
