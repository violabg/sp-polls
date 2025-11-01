"use server";

import { headers } from "next/headers";

/**
 * Rate Limiting Service
 * Currently a stub using in-memory tracking.
 * Replace with Redis or Supabase for production.
 */

// In-memory store for rate limit tracking (reset on server restart)
const rateLimitStore: Map<string, { count: number; resetAt: number }> =
  new Map();

const LIMITS = {
  // AI generation: 5 requests per hour per admin
  AI_GENERATION: { requests: 5, windowMs: 3600000 },
  // Answer submission: 30 requests per minute per user
  ANSWER_SUBMISSION: { requests: 30, windowMs: 60000 },
  // API calls: 100 per minute per IP
  API_CALLS: { requests: 100, windowMs: 60000 },
};

/**
 * Check rate limit for a given key and limit config
 */
export async function checkRateLimit(
  key: string,
  limitConfig: { requests: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  let count = 1;
  let resetAt = now + limitConfig.windowMs;

  if (existing && existing.resetAt > now) {
    count = existing.count + 1;
    resetAt = existing.resetAt;
  }

  rateLimitStore.set(key, { count, resetAt });

  const allowed = count <= limitConfig.requests;

  return {
    allowed,
    remaining: Math.max(0, limitConfig.requests - count),
    resetAt,
  };
}

/**
 * Rate limit for AI generation (admin endpoints)
 */
export async function rateLimitAiGeneration(userId: string) {
  const key = `ai-gen:${userId}`;
  return checkRateLimit(key, LIMITS.AI_GENERATION);
}

/**
 * Rate limit for answer submission
 */
export async function rateLimitAnswerSubmission(userId: string) {
  const key = `answer:${userId}`;
  return checkRateLimit(key, LIMITS.ANSWER_SUBMISSION);
}

/**
 * Rate limit by IP address for general API calls
 */
export async function rateLimitByIp() {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";
  const key = `api:${ip}`;
  return checkRateLimit(key, LIMITS.API_CALLS);
}

/**
 * Cleanup old entries periodically (called by cleanup job)
 */
export async function cleanupExpiredLimits() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}
