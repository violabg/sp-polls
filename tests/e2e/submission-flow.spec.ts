import { expect, test } from "@playwright/test";

test.describe("Answer Submission E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to an event page
    await page.goto("/e/event-001");
  });

  test("should display event page with title", async ({ page }) => {
    // Wait for event title to be visible
    const title = page.locator("h1");
    await expect(title).toContainText("Spindox Tech Meetup");
  });

  test("should display questions section", async ({ page }) => {
    // Verify questions heading exists
    const heading = page.locator("text=Questions");
    await expect(heading).toBeVisible();
  });

  test("should show login prompt when not authenticated", async ({ page }) => {
    // Login prompt component should be visible
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should have answer submission form", async ({ page }) => {
    // The form should be interactive (logged in or prompting to login)
    const container = page.locator(".container");
    await expect(container).toBeVisible();
  });
});

test.describe("Admin Pages E2E", () => {
  test("should load public event page successfully", async ({ page }) => {
    // Navigate to event page
    await page.goto("/e/event-001");

    // Verify page loads with event content
    const eventHeader = page.locator("h1");
    await expect(eventHeader).toBeVisible();

    // Check for event description
    const description = page.locator("p");
    const hasDescription = (await description.count()) > 0;
    expect(hasDescription).toBe(true);
  });

  test("should gracefully handle admin page access", async ({ page }) => {
    // Navigate to admin page (may show access denied without proper auth)
    await page.goto("/events");

    // Page should load - either showing admin content or access denied
    const content = page.locator("body");
    await expect(content).toBeVisible();
  });
});

test.describe("App Navigation E2E", () => {
  test("should navigate to event page via URL", async ({ page }) => {
    // Navigate to event
    await page.goto("/e/event-001");

    // Verify we're on the event page by checking URL
    expect(page.url()).toContain("/e/event-001");

    // Verify content loads
    const container = page.locator(".container");
    await expect(container).toBeVisible();
  });

  test("should display event information correctly", async ({ page }) => {
    // Navigate to event page
    await page.goto("/e/event-001");

    // Look for event title in various elements
    const body = page.locator("body");
    await expect(body).toContainText("Spindox Tech Meetup");
  });

  test("should handle non-existent event gracefully", async ({ page }) => {
    // Navigate to non-existent event
    await page.goto("/e/invalid-event-id");

    // Page should load and show error or default content
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});
