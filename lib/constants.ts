/**
 * Form Configuration Constants
 * Central configuration for form handling and delays
 */

// Mock delay for simulating network conditions (milliseconds)
export const MOCK_DELAY_MS = 2000;

// Form timing constants
export const FORM_TIMING = {
  // Spinner should appear within this time (ms)
  spinnerAppearanceThreshold: 100,
  // Spinner should disappear within this time after completion (ms)
  spinnerDisappearanceThreshold: 500,
  // Standard form submission timeout
  submissionTimeout: 10000,
} as const;

// Success/error message display durations
export const MESSAGE_DISPLAY_DURATIONS = {
  // How long to show success message before clearing (ms)
  success: 3000,
  // How long to show error message before clearing (ms)
  error: 5000,
} as const;
