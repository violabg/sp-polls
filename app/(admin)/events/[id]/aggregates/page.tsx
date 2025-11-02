"use client";

import { AdminEventAggregates } from "@/components/admin-event-aggregates";
import { Button } from "@/components/ui/button";
import type { EventUserAggregatesResponse } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AggregatesPageProps {
  params: Promise<{ id: string }>;
}

export default function AggregatesPage({ params }: AggregatesPageProps) {
  const [eventId, setEventId] = useState<string>("");
  const [data, setData] = useState<EventUserAggregatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setEventId(id);
      fetchAggregates(id);
    });
  }, [params]);

  const fetchAggregates = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${id}/aggregates`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to load aggregates");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto py-8 container">
        <div className="text-center">
          <p className="text-gray-600">Caricamento risposte aggregate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto py-8 container">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg text-center">
          <h1 className="font-bold text-red-900 text-2xl">Errore</h1>
          <p className="mt-2 text-red-700">{error}</p>
          <Button
            onClick={() => eventId && fetchAggregates(eventId)}
            className="mt-4"
          >
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto py-8 container">
        <div className="bg-yellow-50 p-6 border border-yellow-200 rounded-lg text-center">
          <h1 className="font-bold text-yellow-900 text-2xl">Nessun Dato</h1>
          <p className="mt-2 text-yellow-700">
            Non sono state trovate risposte aggregate per questo evento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 container">
      {/* Back Link */}
      <Link
        href={`/events/${data.event.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        &larr; Torna all&apos;Evento
      </Link>

      <AdminEventAggregates data={data} />
    </div>
  );
}
