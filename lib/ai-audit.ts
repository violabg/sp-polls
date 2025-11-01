"use server";

import crypto from "crypto";
import { createAiAudit, getAiAuditsByEventId } from "./mock-data";
import type { AiAudit } from "./types";

/**
 * AI Audit Service
 * Handles logging of AI generation calls for auditability and debugging.
 * Initially uses mock data loader. Replace with DB in production.
 */

export interface AiGenerationLog {
  event_id: string;
  prompt: string;
  model: string;
  response_data: unknown;
}

/**
 * Log an AI generation event
 */
export async function logAiGeneration(log: AiGenerationLog): Promise<AiAudit> {
  const responseHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(log.response_data))
    .digest("hex");

  const audit: AiAudit = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    event_id: log.event_id,
    prompt: log.prompt,
    model: log.model,
    response_hash: `sha256:${responseHash}`,
    created_at: new Date().toISOString(),
  };

  return createAiAudit(audit);
}

/**
 * Retrieve audit logs for an event
 */
export async function getEventAuditLogs(eventId: string): Promise<AiAudit[]> {
  return getAiAuditsByEventId(eventId);
}

/**
 * Verify AI response integrity (simplified)
 */
export async function verifyResponseHash(
  expectedHash: string,
  responseData: unknown
): Promise<boolean> {
  const computedHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(responseData))
    .digest("hex");
  return expectedHash === `sha256:${computedHash}`;
}
