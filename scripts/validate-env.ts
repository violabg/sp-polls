#!/usr/bin/env node

/**
 * Environment Validation Script
 * Checks that required environment variables are set in production.
 * Run this during build or startup.
 */

const requiredEnvVars = {
  // Server-side secrets (production only)
  SUPABASE_SERVICE_ROLE_KEY: {
    required: process.env.NODE_ENV === "production",
    description: "Supabase service role key for server-side operations",
  },
  VERCEL_AI_GATEWAY_KEY: {
    required: process.env.NODE_ENV === "production",
    description: "Vercel AI Gateway key for AI operations",
  },
  // Optional but recommended
  NEXT_PUBLIC_SUPABASE_URL: {
    required: false,
    description: "Supabase project URL (can be public)",
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: false,
    description: "Supabase anonymous key (can be public)",
  },
};

function validateEnv() {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const [envVar, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[envVar];

    if (config.required && !value) {
      errors.push(`Missing required environment variable: ${envVar}`);
      errors.push(`  Description: ${config.description}`);
    } else if (!value) {
      warnings.push(`Optional environment variable not set: ${envVar}`);
      warnings.push(`  Description: ${config.description}`);
    }
  }

  if (warnings.length > 0) {
    console.warn("⚠️  Environment Warnings:");
    warnings.forEach((w) => console.warn(`  ${w}`));
  }

  if (errors.length > 0) {
    console.error("❌ Environment Validation Failed:");
    errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  console.log("✅ Environment validation passed");
}

if (require.main === module) {
  validateEnv();
}

export { validateEnv };
