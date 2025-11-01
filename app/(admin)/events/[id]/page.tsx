"use server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      <Card className="mt-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          <CardDescription>
            Created: {new Date(event.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Questions Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900 text-2xl">
            Questions ({questions.length}/4)
          </h2>
          <form action="/admin/events/[id]/generate-questions" method="POST">
            <Button type="submit">Generate Questions</Button>
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
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {idx + 1}. {question.text}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mt-3">
                    <RadioGroup defaultValue={String(question.correct_choice)}>
                      {question.choices.map((choice) => (
                        <div key={choice.id} className="flex items-center">
                          <RadioGroupItem
                            value={String(choice.id)}
                            disabled
                            className={
                              choice.id === question.correct_choice
                                ? "border-green-600 bg-green-50"
                                : undefined
                            }
                          />
                          <span
                            className={`ml-3 ${
                              choice.id === question.correct_choice
                                ? "text-green-700 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {choice.text}
                          </span>
                          {choice.id === question.correct_choice && (
                            <span className="bg-green-100 ml-2 px-2 py-1 rounded font-semibold text-green-800 text-xs">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
