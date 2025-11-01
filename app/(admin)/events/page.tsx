"use server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
              <Card className="mt-6 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">{event.title}</CardTitle>
                  <CardDescription>
                    Created: {new Date(event.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mt-2text-md">{event.description}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      event.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
