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
      <div className="mx-auto py-8 container">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg text-center">
          <h1 className="font-bold text-red-900 text-2xl">Access Denied</h1>
          <p className="mt-2 text-red-700">
            You do not have permission to view aggregates.
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
    <div className="mx-auto py-8 container">
      <Link
        href={`/events/${event.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        &larr; Back to Event
      </Link>

      <h1 className="mt-6 font-bold text-gray-900 text-3xl">
        {event.title} - Aggregated Results
      </h1>

      <div className="gap-4 grid grid-cols-2 bg-white mt-6 mb-8 p-6 border border-gray-200 rounded-lg">
        <div>
          <p className="text-gray-600 text-sm">Total Respondents</p>
          <p className="font-bold text-gray-900 text-3xl">{totalRespondents}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Total Questions</p>
          <p className="font-bold text-gray-900 text-3xl">{questions.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        {stats.map((stat, idx) => (
          <div
            key={stat.question_id}
            className="bg-white p-6 border border-gray-200 rounded-lg"
          >
            <h2 className="mb-4 font-semibold text-gray-900 text-xl">
              {idx + 1}. {stat.question_text}
            </h2>

            <div className="gap-4 grid grid-cols-3 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Answers</p>
                <p className="font-bold text-blue-600 text-2xl">
                  {stat.total_answers}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Correct</p>
                <p className="font-bold text-green-600 text-2xl">
                  {stat.correct_answers}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Success Rate</p>
                <p className="font-bold text-purple-600 text-2xl">
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
                    <div className="bg-gray-200 mt-1 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${choice.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 w-20 text-right">
                    <p className="font-semibold text-gray-900">
                      {choice.count}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {choice.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white mt-8 p-6 border border-gray-200 rounded-lg">
        <h2 className="mb-4 font-semibold text-gray-900">Export Options</h2>
        <a
          href={`/api/events/${event.id}/answers?format=csv`}
          className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
        >
          Download CSV (Anonymized)
        </a>
      </div>
    </div>
  );
}
