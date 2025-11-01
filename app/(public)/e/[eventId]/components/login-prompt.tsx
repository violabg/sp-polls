"use client";

import Link from "next/link";

export function LoginPrompt() {
  return (
    <div className="rounded-lg border border-gray-200 bg-blue-50 p-6 text-center">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">
        Authentication Required
      </h2>
      <p className="mb-4 text-gray-600">
        Please log in to participate in this event and submit your answers.
      </p>
      <Link
        href="/auth/login"
        className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Log In
      </Link>
    </div>
  );
}
