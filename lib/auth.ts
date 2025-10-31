"use server";

/**
 * Auth Service (Stub)
 * Placeholder for Supabase Auth integration.
 * Replace with actual Supabase JS client in production.
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

/**
 * Get current authenticated user
 * TODO: Integrate with Supabase Auth
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // For now, return mock user for testing
  // In production: extract from Supabase session
  return {
    id: "user-001",
    email: "user@example.com",
    name: "Test User",
    role: "user",
  };
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Get login URL
 */
export async function getLoginUrl(redirectTo?: string): Promise<string> {
  const params = new URLSearchParams();
  if (redirectTo) params.set("redirect_to", redirectTo);
  return `/auth/login?${params.toString()}`;
}
