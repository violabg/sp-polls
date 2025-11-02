/**
 * Italian UI Labels and Messages
 * Centralized Italian text for form handling and UI
 */

export interface ItalianLabels {
  // Button labels
  submit: string;
  cancel: string;
  save: string;
  create: string;
  delete: string;
  edit: string;
  back: string;
  send: string;
  loading: string;
  loading_indicator: string;

  // Form labels
  event_name: string;
  date: string;
  description: string;
  your_response: string;
  question_text: string;
  question_type: string;
  options: string;
  required: string;

  // Messages
  saving: string;
  saved_success: string;
  created_success: string;
  event_created_success: string;
  error: string;
  success: string;
  loading_message: string;
  submission_in_progress: string;

  // Validation messages
  required_field: string;
  invalid_email: string;
  invalid_format: string;
  min_length: (min: number) => string;
  max_length: (max: number) => string;

  // Navigation
  events: string;
  admin: string;
  home: string;
  responses: string;
  status: string;
  total_responses: string;

  // Additional context
  caricamento: string; // "Loading" (alternative)
  invia: string; // "Submit" (alternative)
  cancella: string; // "Cancel" (alternative)
  salva: string; // "Save" (alternative)
  crea: string; // "Create" (alternative)
  indietro: string; // "Back" (alternative)
}

export const italianLabels: ItalianLabels = {
  // Button labels
  submit: "Invia",
  cancel: "Cancella",
  save: "Salva",
  create: "Crea",
  delete: "Elimina",
  edit: "Modifica",
  back: "Indietro",
  send: "Invia",
  loading: "Caricamento...",
  loading_indicator: "Caricamento in corso...",

  // Form labels
  event_name: "Nome Evento",
  date: "Data",
  description: "Descrizione",
  your_response: "La Tua Risposta",
  question_text: "Testo Domanda",
  question_type: "Tipo Domanda",
  options: "Opzioni",
  required: "Obbligatorio",

  // Messages
  saving: "Salvataggio...",
  saved_success: "Salvato con successo",
  created_success: "Creato con successo",
  event_created_success: "Evento creato con successo",
  error: "Errore",
  success: "Successo",
  loading_message: "Caricamento in corso...",
  submission_in_progress: "Invio in corso...",

  // Validation messages
  required_field: "Campo obbligatorio",
  invalid_email: "Formato email non valido",
  invalid_format: "Formato non valido",
  min_length: (min) => `Minimo ${min} caratteri`,
  max_length: (max) => `Massimo ${max} caratteri`,

  // Navigation
  events: "Eventi",
  admin: "Amministrazione",
  home: "Home",
  responses: "Risposte",
  status: "Stato",
  total_responses: "Risposte Totali",

  // Additional context (direct Italian words)
  caricamento: "Caricamento...",
  invia: "Invia",
  cancella: "Cancella",
  salva: "Salva",
  crea: "Crea",
  indietro: "Indietro",
};
