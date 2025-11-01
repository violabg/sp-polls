import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ViewTransition } from "react";

type EventType = {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  status?: string;
  qr_code_url?: string;
};

export default function AdminEventCard({ event }: { event: EventType }) {
  const statusLabel =
    event?.status === "published"
      ? "pubblicato"
      : event?.status === "draft"
      ? "bozza"
      : event?.status;

  return (
    <ViewTransition name={`event-card-${event.id}`}>
      <Card className="mt-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{event?.title}</CardTitle>
          <CardDescription>
            Creato:{" "}
            {event?.created_at
              ? new Date(event.created_at).toLocaleDateString()
              : "-"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mt-2 text-gray-600">{event?.description}</p>
          <div className="gap-4 grid grid-cols-2 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Stato:</span>
              <Badge
                className={`${
                  event?.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {statusLabel}
              </Badge>
            </div>
            <div>
              <span className="font-semibold text-gray-700">QR Code:</span>
              <code className="bg-gray-100 ml-2 px-2 py-1 rounded text-gray-700">
                {event?.qr_code_url}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </ViewTransition>
  );
}
