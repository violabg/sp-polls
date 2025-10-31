// User entity
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

// Event entity
export interface Event {
  id: string;
  title: string;
  description: string;
  qr_code_url: string;
  created_by: string;
  created_at: string;
  status: "draft" | "published" | "archived";
}

// Choice for questions
export interface Choice {
  id: string;
  text: string;
}

// Question entity (public payload - correct_choice is server-only)
export interface Question {
  id: string;
  event_id: string;
  text: string;
  choices: Choice[];
  generated_by_ai: boolean;
  created_at: string;
  // correct_choice is intentionally NOT included in client payloads
}

// Question entity with server-side correct_choice
export interface QuestionWithCorrectChoice extends Question {
  correct_choice: string;
}

// Answer entity
export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  selected_choice: string;
  is_correct: boolean;
  created_at: string;
}

// AI Audit entity
export interface AiAudit {
  id: string;
  event_id: string;
  prompt: string;
  model: string;
  response_hash: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Question generation request/response
export interface GenerateQuestionsRequest {
  event_id: string;
  topic?: string;
}

export interface GenerateQuestionsResponse {
  questions: Question[];
  audit_id: string;
}

// Answer submission request/response
export interface SubmitAnswerRequest {
  question_id: string;
  selected_choice: string;
}

export interface SubmitAnswerResponse {
  answer_id: string;
  is_correct: boolean;
}

// Aggregated statistics per question
export interface QuestionStats {
  question_id: string;
  question_text: string;
  total_answers: number;
  correct_answers: number;
  percentage_correct: number;
  choices_breakdown: {
    choice_id: string;
    choice_text: string;
    count: number;
    percentage: number;
  }[];
}

// Event aggregates response
export interface EventAggregatesResponse {
  event_id: string;
  event_title: string;
  total_respondents: number;
  questions: QuestionStats[];
  generated_at: string;
}
