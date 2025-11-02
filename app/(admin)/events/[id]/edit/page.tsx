import { getEventById } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { EditForm } from "./edit-form";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;

  // Fetch event data on the server
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto p-4 container">
      <h1 className="mb-4 font-bold text-2xl">Modifica Evento</h1>
      <EditForm event={event} />
    </div>
  );
}
