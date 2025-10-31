"use server";

import { isAdmin } from "@/lib/auth";
import { getAllEvents } from "@/lib/mock-data";
import Link from "next/link";

export default async function AdminEventsPage() {
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-900">Access Denied</h1>
          <p className="mt-2 text-red-700">
            You do not have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const events = await getAllEvents();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Events</h1>
        <Link
          href="/admin/events/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-600">
            No events yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {event.title}
              </h2>
              <p className="mt-1 text-gray-600">{event.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Created: {new Date(event.created_at).toLocaleDateString()}
              </p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  event.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {event.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
