import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventUserAggregatesResponse } from "@/lib/types";

interface AdminEventAggregatesProps {
  data: EventUserAggregatesResponse;
}

export function AdminEventAggregates({ data }: AdminEventAggregatesProps) {
  const { event, aggregates } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-gray-900 text-3xl">
          Risposte Aggregate - {event.title}
        </h1>
        <p className="mt-2 text-gray-600">
          {aggregates.length} partecipanti hanno risposto alle domande
        </p>
      </div>

      {/* Aggregates */}
      {aggregates.length === 0 ? (
        <div className="bg-yellow-50 p-6 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-700">
            Nessuna risposta ancora ricevuta per questo evento.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {aggregates.map((aggregate) => (
            <Card key={aggregate.user.id}>
              <CardHeader>
                <CardTitle className="text-xl">{aggregate.user.name}</CardTitle>
                <p className="text-gray-600 text-sm">{aggregate.user.email}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aggregate.answers.map((answer) => (
                    <div
                      key={answer.question_id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h4 className="mb-2 font-semibold text-gray-900">
                        {answer.question_text}
                      </h4>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-700">
                          Risposta: {answer.selected_choice}
                        </p>
                        <Badge
                          variant={
                            answer.is_correct === true
                              ? "default"
                              : answer.is_correct === false
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {answer.is_correct === true
                            ? "Corretta"
                            : answer.is_correct === false
                            ? "Sbagliata"
                            : "Da Verificare"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
