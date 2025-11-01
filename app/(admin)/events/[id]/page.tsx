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
      <div className="mx-auto py-8 container">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg text-center">
          <h1 className="font-bold text-red-900 text-2xl">Access Denied</h1>
          <p className="mt-2 text-red-700">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto py-8 container">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg text-center">
          <h1 className="font-bold text-red-900 text-2xl">Event Not Found</h1>
          <p className="mt-2 text-red-700">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 container">
      {/* Back Link */}
      <Link href="/events" className="text-blue-600 hover:text-blue-800">
        &larr; Back to Events
      </Link>

      {/* Event Header */}
      <div className="bg-white mt-6 mb-8 p-6 border border-gray-200 rounded-lg">
        <h1 className="font-bold text-gray-900 text-3xl">{event.title}</h1>
        <p className="mt-2 text-gray-600">{event.description}</p>
        <div className="gap-4 grid grid-cols-2 mt-4 text-sm">
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
            <code className="bg-gray-100 ml-2 px-2 py-1 rounded text-gray-700">
              {event.qr_code_url}
            </code>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900 text-2xl">
            Questions ({questions.length}/4)
          </h2>
          <form action="/admin/events/[id]/generate-questions" method="POST">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white"
            >
              Generate Questions
            </button>
          </form>
        </div>

        {questions.length === 0 ? (
          <div className="bg-yellow-50 p-6 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">
              No questions yet. Generate AI questions to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, idx) => (
              <div
                key={question.id}
                className="bg-white p-4 border border-gray-200 rounded-lg"
              >
                <h3 className="font-semibold text-gray-900">
                  {idx + 1}. {question.text}
                </h3>
                <div className="space-y-2 mt-3">
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
                        <span className="bg-green-100 ml-2 px-2 py-1 rounded font-semibold text-green-800 text-xs">
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
      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <h3 className="mb-4 font-semibold text-gray-900">Admin Actions</h3>
        <div className="space-y-2">
          <Link
            href={`/events/${event.id}/aggregates`}
            className="block bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md text-blue-600"
          >
            View Aggregated Answers
          </Link>
          <Link
            href={`/events/${event.id}/edit`}
            className="block bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-600"
          >
            Edit Event
          </Link>
        </div>
      </div>
    </div>
  );
}
