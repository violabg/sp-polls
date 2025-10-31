"use server";

import { isAdmin } from "@/lib/auth";
import {
  getAllAnswers,
  getEventById,
  getQuestionsByEventIdWithCorrectChoice,
} from "@/lib/mock-data";
import type { QuestionStats } from "@/lib/types";
import Link from "next/link";

export default async function EventAggregatesPage({
  params,
}: {
  params: { id: string };
}) {
  const [adminCheck, event, questions, allAnswers] = await Promise.all([
    isAdmin(),
    getEventById(params.id),
    getQuestionsByEventIdWithCorrectChoice(params.id),
    getAllAnswers(),
  ]);

  if (!adminCheck) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-900">Access Denied</h1>
          <p className="mt-2 text-red-700">
            You do not have permission to view aggregates.
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
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats: QuestionStats[] = questions.map((question) => {
    const questionAnswers = allAnswers.filter(
      (a) => a.question_id === question.id
    );
    const correctAnswers = questionAnswers.filter((a) => a.is_correct);

    const choicesBreakdown = question.choices.map((choice) => {
      const count = questionAnswers.filter(
        (a) => a.selected_choice === choice.id
      ).length;
      const percentage =
        questionAnswers.length > 0
          ? Math.round((count / questionAnswers.length) * 100)
          : 0;

      return {
        choice_id: choice.id,
        choice_text: choice.text,
        count,
        percentage,
      };
    });

    return {
      question_id: question.id,
      question_text: question.text,
      total_answers: questionAnswers.length,
      correct_answers: correctAnswers.length,
      percentage_correct:
        questionAnswers.length > 0
          ? Math.round((correctAnswers.length / questionAnswers.length) * 100)
          : 0,
      choices_breakdown: choicesBreakdown,
    };
  });

  const totalRespondents = new Set(
    allAnswers
      .filter((a) => questions.map((q) => q.id).includes(a.question_id))
      .map((a) => a.user_id)
  ).size;

  return (
    <div className="container mx-auto py-8">
      <Link
        href={`/admin/events/${event.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        &larr; Back to Event
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        {event.title} - Aggregated Results
      </h1>

      <div className="mb-8 mt-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <p className="text-sm text-gray-600">Total Respondents</p>
          <p className="text-3xl font-bold text-gray-900">{totalRespondents}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Questions</p>
          <p className="text-3xl font-bold text-gray-900">{questions.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        {stats.map((stat, idx) => (
          <div
            key={stat.question_id}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {idx + 1}. {stat.question_text}
            </h2>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-600">Total Answers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stat.total_answers}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-600">Correct</p>
                <p className="text-2xl font-bold text-green-600">
                  {stat.correct_answers}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stat.percentage_correct}%
                </p>
              </div>
            </div>

            <h3 className="mb-3 font-semibold text-gray-900">
              Choice Breakdown
            </h3>
            <div className="space-y-3">
              {stat.choices_breakdown.map((choice) => (
                <div key={choice.choice_id} className="flex items-center">
                  <div className="flex-1">
                    <p className="text-gray-700">{choice.choice_text}</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${choice.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 w-20 text-right">
                    <p className="font-semibold text-gray-900">
                      {choice.count}
                    </p>
                    <p className="text-sm text-gray-600">
                      {choice.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-gray-900">Export Options</h2>
        <a
          href={`/api/events/${event.id}/answers?format=csv`}
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Download CSV (Anonymized)
        </a>
      </div>
    </div>
  );
}
