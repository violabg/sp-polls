/**
 * Sleep Utility
 * Creates a promise that resolves after a specified delay
 * Useful for simulating network delays in testing and development
 */

/**
 * Returns a promise that resolves after the specified milliseconds
 * @param ms - Delay in milliseconds
 * @returns Promise that resolves after delay
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Delays execution of an async function
 * @param fn - Async function to delay
 * @param ms - Delay in milliseconds before execution
 * @returns Promise that resolves to function result
 */
export async function delayedExecution<T>(
  fn: () => Promise<T>,
  ms: number
): Promise<T> {
  await sleep(ms);
  return fn();
}
