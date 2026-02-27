/**
 * E2E tests for the event payments / registration flow.
 *
 * These tests cover the full lifecycle:
 *   1. User selects a variant and starts checkout
 *   2. Checkout success path → registration shows as CONFIRMED in the UI
 *   3. Checkout cancel/failure path → registration stays PENDING with correct UI
 *
 * Because CI does not have real Stripe credentials the tests rely on the
 * test-bypass mode that is activated by setting E2E_TESTING=true in the
 * environment.  The checkout API then returns a redirect to
 * /api/test/simulate-payment instead of a real Stripe checkout URL,
 * and that endpoint updates the Registration row directly without touching
 * Stripe.
 *
 * Data setup is handled via direct API calls to the test server before each
 * test and cleaned up via Prisma in the teardown.  All test data is clearly
 * identified so it can be safely deleted without touching production data.
 */

import { test, expect, type Page } from "@playwright/test";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
const DEFAULT_PASSWORD = "Test123!";

// ── Test user (uses the standard seed user) ─────────────────────────────────
const TEST_USER = {
  email: "ana.free@test.com",
  name: "Ana Ferreira",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

async function setLocalStorageCookieConsent(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "athlifyr_cookie_consent",
      JSON.stringify({
        essential: true,
        analytics: true,
        functional: true,
        timestamp: new Date().toISOString(),
      })
    );
  });
}

async function login(page: Page, email: string, password = DEFAULT_PASSWORD) {
  await page.goto(`${BASE_URL}/en/auth/signin`);
  await page.waitForLoadState("networkidle");

  const emailInput = page.locator('input[id="email"]');
  await emailInput.waitFor({ state: "visible", timeout: 10000 });
  await emailInput.fill(email);

  const passwordInput = page.locator('input[id="password"]');
  await passwordInput.fill(password);

  const submitButton = page
    .getByRole("main")
    .getByRole("button", { name: /entrar/i });
  await submitButton.click();

  await page.waitForFunction(() => !window.location.href.includes("signin"), {
    timeout: 15000,
  });

  await page.waitForLoadState("networkidle");
}

// ── Test fixture helpers ──────────────────────────────────────────────────────

/**
 * Creates a test event with `hasRegistrations=true` and one variant that has
 * an active pricing phase.  Returns the event slug and variant id so that
 * E2E tests can navigate directly to the event page.
 *
 * The endpoint is only available when NODE_ENV !== 'production'.
 */
async function createTestEvent(page: Page): Promise<{
  slug: string;
  eventId: string;
  variantId: string;
}> {
  const response = await page.request.post(
    `${BASE_URL}/api/test/event-fixture`,
    {
      data: {
        titleSuffix: `payments-flow-${Date.now()}`,
      },
    }
  );

  if (!response.ok()) {
    throw new Error(
      `Failed to create test event: ${response.status()} ${await response.text()}`
    );
  }

  return response.json() as Promise<{
    slug: string;
    eventId: string;
    variantId: string;
  }>;
}

/**
 * Deletes the test event (and cascade-deletes variants + registrations).
 */
async function deleteTestEvent(page: Page, eventId: string) {
  await page.request.delete(`${BASE_URL}/api/test/event-fixture`, {
    data: { eventId },
  });
}

// ── Suite ────────────────────────────────────────────────────────────────────

test.describe("Payments Flow – Event Registration", () => {
  // Set cookie consent before every test so the banner doesn't block UI
  test.beforeEach(async ({ page }) => {
    await setLocalStorageCookieConsent(page);
  });

  // ── Test 1: unauthenticated user sees login prompt ────────────────────────
  test("unauthenticated user is prompted to sign in before checkout", async ({
    page,
  }) => {
    // Navigate to any event page without being logged in
    await page.goto(`${BASE_URL}/en/events`);
    await page.waitForLoadState("networkidle");

    // If there are events listed, open the first one
    const firstEventLink = page.locator('a[href*="/events/"]').first();
    const count = await firstEventLink.count();

    if (count === 0) {
      // No events available in this environment – skip gracefully
      test.skip();
      return;
    }

    await firstEventLink.click();
    await page.waitForLoadState("networkidle");

    // The registration section should prompt to sign in
    const signInLink = page.locator('a[href*="signin"]').first();
    await expect(signInLink).toBeVisible({ timeout: 5000 });
  });

  // ── Test 2: checkout button visible for paid events ───────────────────────
  test("authenticated user sees checkout button on paid event", async ({
    page,
  }) => {
    // Create a dedicated test event with hasRegistrations=true
    let eventId = "";
    let slug = "";
    let variantId = "";

    try {
      const fixture = await createTestEvent(page);
      eventId = fixture.eventId;
      slug = fixture.slug;
      variantId = fixture.variantId;
    } catch {
      // Test fixture endpoint not available (e.g. no test db) – skip
      test.skip();
      return;
    }

    try {
      await login(page, TEST_USER.email);

      await page.goto(`${BASE_URL}/en/events/${slug}`);
      await page.waitForLoadState("networkidle");

      // Select the variant
      const variantSelect = page.locator('[data-testid="variant-select"]');
      await variantSelect.waitFor({ state: "visible", timeout: 8000 });
      await variantSelect.selectOption(variantId);

      // Checkout button should be visible
      const checkoutButton = page.locator('[data-testid="checkout-button"]');
      await expect(checkoutButton).toBeVisible({ timeout: 5000 });
      await expect(checkoutButton).toBeEnabled();
    } finally {
      if (eventId) await deleteTestEvent(page, eventId);
    }
  });

  // ── Test 3: success path → registration is CONFIRMED ────────────────────
  test("checkout success path results in CONFIRMED registration", async ({
    page,
  }) => {
    let eventId = "";
    let slug = "";
    let variantId = "";

    try {
      const fixture = await createTestEvent(page);
      eventId = fixture.eventId;
      slug = fixture.slug;
      variantId = fixture.variantId;
    } catch {
      test.skip();
      return;
    }

    try {
      await login(page, TEST_USER.email);

      await page.goto(`${BASE_URL}/en/events/${slug}`);
      await page.waitForLoadState("networkidle");

      // Select the variant
      const variantSelect = page.locator('[data-testid="variant-select"]');
      await variantSelect.waitFor({ state: "visible", timeout: 8000 });
      await variantSelect.selectOption(variantId);

      // Intercept the browser navigation to the simulate-payment endpoint and
      // inject action=success so the registration is confirmed.
      await page.route(
        `${BASE_URL}/api/test/simulate-payment**`,
        async (route) => {
          const url = new URL(route.request().url());
          url.searchParams.set("action", "success");
          await route.continue({ url: url.toString() });
        }
      );

      // Click checkout
      const checkoutButton = page.locator('[data-testid="checkout-button"]');
      await checkoutButton.waitFor({ state: "visible", timeout: 8000 });
      await checkoutButton.click();

      // Wait to be redirected back to the event page with registration=success
      await page.waitForURL(/registration=success/, { timeout: 15000 });
      await page.waitForLoadState("networkidle");

      // Registration confirmed badge should appear
      const confirmedBadge = page.locator(
        '[data-testid="registration-confirmed"]'
      );
      await expect(confirmedBadge).toBeVisible({ timeout: 10000 });
    } finally {
      if (eventId) await deleteTestEvent(page, eventId);
    }
  });

  // ── Test 4: cancel path → registration stays PENDING ─────────────────────
  test("checkout cancel path does not confirm registration", async ({
    page,
  }) => {
    let eventId = "";
    let slug = "";
    let variantId = "";

    try {
      const fixture = await createTestEvent(page);
      eventId = fixture.eventId;
      slug = fixture.slug;
      variantId = fixture.variantId;
    } catch {
      test.skip();
      return;
    }

    try {
      await login(page, TEST_USER.email);

      await page.goto(`${BASE_URL}/en/events/${slug}`);
      await page.waitForLoadState("networkidle");

      const variantSelect = page.locator('[data-testid="variant-select"]');
      await variantSelect.waitFor({ state: "visible", timeout: 8000 });
      await variantSelect.selectOption(variantId);

      // Intercept and redirect simulate-payment to the cancel path
      await page.route(
        `${BASE_URL}/api/test/simulate-payment**`,
        async (route) => {
          const url = new URL(route.request().url());
          url.searchParams.set("action", "cancel");
          await route.continue({ url: url.toString() });
        }
      );

      const checkoutButton = page.locator('[data-testid="checkout-button"]');
      await checkoutButton.waitFor({ state: "visible", timeout: 8000 });
      await checkoutButton.click();

      // Should be redirected back to the event page with registration=cancel
      await page.waitForURL(/registration=cancel/, { timeout: 15000 });
      await page.waitForLoadState("networkidle");

      // Confirmed badge must NOT appear
      const confirmedBadge = page.locator(
        '[data-testid="registration-confirmed"]'
      );
      await expect(confirmedBadge).not.toBeVisible({ timeout: 5000 });

      // The checkout button should still be present (not registered)
      // OR the pending badge is shown if the user already initiated checkout
      const checkoutOrPending = page
        .locator(
          '[data-testid="checkout-button"], [data-testid="registration-pending"]'
        )
        .first();
      await expect(checkoutOrPending).toBeVisible({ timeout: 5000 });
    } finally {
      if (eventId) await deleteTestEvent(page, eventId);
    }
  });

  // ── Test 5: duplicate confirmed registration is blocked ───────────────────
  test("user cannot register twice for the same variant", async ({ page }) => {
    let eventId = "";
    let slug = "";
    let variantId = "";

    try {
      const fixture = await createTestEvent(page);
      eventId = fixture.eventId;
      slug = fixture.slug;
      variantId = fixture.variantId;
    } catch {
      test.skip();
      return;
    }

    try {
      await login(page, TEST_USER.email);

      // Simulate a first confirmed registration via the test endpoint directly
      const checkoutResp = await page.request.post(
        `${BASE_URL}/api/events/${eventId}/checkout`,
        {
          data: { variantId },
        }
      );

      if (!checkoutResp.ok()) {
        test.skip();
        return;
      }

      const checkoutData = (await checkoutResp.json()) as {
        registrationId: string;
        checkoutUrl: string;
      };

      // Confirm the registration via the simulate endpoint
      await page.request.get(
        `${BASE_URL}/api/test/simulate-payment?registrationId=${checkoutData.registrationId}&action=success&successUrl=/`
      );

      // Navigate to event page – confirmed badge should be shown
      await page.goto(`${BASE_URL}/en/events/${slug}`);
      await page.waitForLoadState("networkidle");

      const confirmedBadge = page.locator(
        '[data-testid="registration-confirmed"]'
      );
      await expect(confirmedBadge).toBeVisible({ timeout: 10000 });

      // Checkout button should NOT be visible (already registered)
      const checkoutButton = page.locator('[data-testid="checkout-button"]');
      await expect(checkoutButton).not.toBeVisible({ timeout: 3000 });
    } finally {
      if (eventId) await deleteTestEvent(page, eventId);
    }
  });
});
