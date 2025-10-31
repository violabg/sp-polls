"use server";

import { promises as fs } from "fs";
import path from "path";
import type {
  AiAudit,
  Answer,
  Event,
  Question,
  QuestionWithCorrectChoice,
  User,
} from "./types";

const MOCK_DATA_DIR = path.join(process.cwd(), "mock");

/**
 * Mock data loader for development.
 * Reads from mock/*.json files. Replace with DB queries in production.
 */

async function readMockFile<T>(filename: string): Promise<T> {
  try {
    const filePath = path.join(MOCK_DATA_DIR, filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading mock file ${filename}:`, error);
    return [] as unknown as T;
  }
}

async function writeMockFile<T>(filename: string, data: T): Promise<void> {
  try {
    const filePath = path.join(MOCK_DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing mock file ${filename}:`, error);
    throw error;
  }
}

// Events
export async function getAllEvents(): Promise<Event[]> {
  return readMockFile<Event[]>("events.json");
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const events = await getAllEvents();
  return events.find((e) => e.id === eventId) || null;
}

export async function createEvent(event: Event): Promise<Event> {
  const events = await getAllEvents();
  events.push(event);
  await writeMockFile("events.json", events);
  return event;
}

// Questions
export async function getQuestionsByEventId(
  eventId: string
): Promise<Question[]> {
  const questions = await readMockFile<QuestionWithCorrectChoice[]>(
    "questions.json"
  );
  // Filter by event and strip correct_choice from public payload
  return questions
    .filter((q) => q.event_id === eventId)
    .map((q) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { correct_choice, ...publicQuestion } = q;
      return publicQuestion as Question;
    });
}

export async function getQuestionsByEventIdWithCorrectChoice(
  eventId: string
): Promise<QuestionWithCorrectChoice[]> {
  const questions = await readMockFile<QuestionWithCorrectChoice[]>(
    "questions.json"
  );
  return questions.filter((q) => q.event_id === eventId);
}

export async function getQuestionById(
  questionId: string
): Promise<QuestionWithCorrectChoice | null> {
  const questions = await readMockFile<QuestionWithCorrectChoice[]>(
    "questions.json"
  );
  return questions.find((q) => q.id === questionId) || null;
}

export async function createQuestions(
  questions: QuestionWithCorrectChoice[]
): Promise<QuestionWithCorrectChoice[]> {
  const existing = await readMockFile<QuestionWithCorrectChoice[]>(
    "questions.json"
  );
  const updated = [...existing, ...questions];
  await writeMockFile("questions.json", updated);
  return questions;
}

// Answers
export async function getAllAnswers(): Promise<Answer[]> {
  return readMockFile<Answer[]>("answers.json");
}

export async function getAnswersByQuestionId(
  questionId: string
): Promise<Answer[]> {
  const answers = await getAllAnswers();
  return answers.filter((a) => a.question_id === questionId);
}

export async function getAnswersByUserId(userId: string): Promise<Answer[]> {
  const answers = await getAllAnswers();
  return answers.filter((a) => a.user_id === userId);
}

export async function getAnswerByUserAndQuestion(
  userId: string,
  questionId: string
): Promise<Answer | null> {
  const answers = await getAllAnswers();
  return (
    answers.find((a) => a.user_id === userId && a.question_id === questionId) ||
    null
  );
}

export async function createAnswer(answer: Answer): Promise<Answer> {
  const answers = await getAllAnswers();
  answers.push(answer);
  await writeMockFile("answers.json", answers);
  return answer;
}

// Users
export async function getAllUsers(): Promise<User[]> {
  return readMockFile<User[]>("users.json");
}

export async function getUserById(userId: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u) => u.id === userId) || null;
}

// AI Audit
export async function getAllAiAudits(): Promise<AiAudit[]> {
  return readMockFile<AiAudit[]>("ai_audit.json");
}

export async function getAiAuditsByEventId(
  eventId: string
): Promise<AiAudit[]> {
  const audits = await getAllAiAudits();
  return audits.filter((a) => a.event_id === eventId);
}

export async function createAiAudit(audit: AiAudit): Promise<AiAudit> {
  const audits = await getAllAiAudits();
  audits.push(audit);
  await writeMockFile("ai_audit.json", audits);
  return audit;
}
