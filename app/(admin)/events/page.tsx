"use server";

import AdminEventCard from "@/components/admin-event-card";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/auth";
import { getAllEvents } from "@/lib/mock-data";
import Link from "next/link";

export default async function AdminEventsPage() {
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    return (
      <div className="mx-auto py-8 container">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg text-center">
          <h1 className="font-bold text-red-900 text-2xl">Access Denied</h1>
          <p className="mt-2 text-red-700">
            You do not have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const events = await getAllEvents();

  return (
    <div className="mx-auto py-8 container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-gray-900 text-3xl">Admin Events</h1>
        <Button asChild>
          <Link href="/events/new">Create Event</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">
            No events yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <AdminEventCard event={event} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
