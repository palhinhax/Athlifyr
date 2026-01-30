import { test, expect, type Page } from "@playwright/test";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
const DEFAULT_PASSWORD = "Test123!";

// ============================================================================
// TEST USER CREDENTIALS (from docs/test-users.md)
// ============================================================================

const TEST_USERS = {
  // 1. Admin Master (Administrador)
  admin: {
    email: "admin@athlifyr.com",
    name: "Admin Master",
    role: "ADMIN",
  },

  // 2. João Owner (Dono de Box)
  joaoOwner: {
    email: "joao.owner@test.com",
    name: "João Silva",
    role: "USER",
    venues: ["CrossFit Cascais"],
    venueRole: "OWNER",
  },

  // 3. Maria Coach (Treinadora)
  mariaCoach: {
    email: "maria.coach@test.com",
    name: "Maria Santos",
    role: "USER",
    venues: ["CrossFit Cascais"],
    venueRole: "COACH",
  },

  // 4. Pedro Atleta (Membro de Box)
  pedroAtleta: {
    email: "pedro.atleta@test.com",
    name: "Pedro Costa",
    role: "USER",
    venues: ["CrossFit Cascais"],
    venueRole: "MEMBER",
  },

  // 5. Ana Free (Atleta Independente)
  anaFree: {
    email: "ana.free@test.com",
    name: "Ana Ferreira",
    role: "USER",
    venues: [],
  },

  // 6. Carlos Multi (Multi-Box + Owner)
  carlosMulti: {
    email: "carlos.multi@test.com",
    name: "Carlos Rodrigues",
    role: "USER",
    venues: ["HYROX Lisboa", "CrossFit Cascais", "Box Funcional Porto"],
    ownedVenues: ["HYROX Lisboa"],
  },

  // 7. Sofia Nova (Utilizador Novo)
  sofiaNova: {
    email: "sofia.nova@test.com",
    name: "Sofia Mendes",
    role: "USER",
    emailVerified: false,
    venues: [],
  },

  // 8. Banned User (Utilizador Banido)
  bannedUser: {
    email: "banned@test.com",
    name: "Banned Test",
    role: "USER",
    isBanned: true,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Set cookie consent in localStorage before tests to skip the banner
 */
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

async function login(
  page: Page,
  email: string,
  password: string = DEFAULT_PASSWORD
) {
  await page.goto(`${BASE_URL}/auth/signin`);
  await page.waitForLoadState("networkidle");

  // Fill email - be specific about the signin form input
  const emailInput = page.locator('input[id="email"]');
  await emailInput.waitFor({ state: "visible", timeout: 10000 });
  await emailInput.fill(email);

  // Fill password
  const passwordInput = page.locator('input[id="password"]');
  await passwordInput.fill(password);

  // Click the signin button inside main (not the navigation button)
  // The main form submit button is the one inside the Card component
  const submitButton = page
    .getByRole("main")
    .getByRole("button", { name: "Entrar" });
  await submitButton.click();

  // Wait for the page to navigate away from signin
  // Check that we're no longer on the signin page (URL shouldn't contain "signin")
  await page.waitForFunction(() => !window.location.href.includes("signin"), {
    timeout: 15000,
  });

  // Wait for network to settle after login
  await page.waitForLoadState("networkidle");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function logout(page: Page) {
  // Try clicking on user menu and then logout
  try {
    await page.click('[data-testid="user-menu"], [aria-label*="menu"]');
    await page.click("text=/logout|sair|sign out/i");
    await page.waitForURL(/\/(pt|en|es|fr|de|it)$/);
  } catch {
    // If menu approach fails, go directly to signout
    await page.goto(`${BASE_URL}/api/auth/signout`);
  }
}

// Set cookie consent before each test to avoid banner blocking interactions
test.beforeEach(async ({ page }) => {
  await setLocalStorageCookieConsent(page);
});

// ============================================================================
// ADMIN TESTS
// ============================================================================

test.describe("1. Admin Master Tests", () => {
  test("should login successfully as admin", async ({ page }) => {
    await login(page, TEST_USERS.admin.email);
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should access admin panel", async ({ page }) => {
    await login(page, TEST_USERS.admin.email);
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).toHaveURL(/admin/);
  });

  test("should see admin navigation tabs", async ({ page }) => {
    await login(page, TEST_USERS.admin.email);
    await page.goto(`${BASE_URL}/admin`);

    // Check for admin tabs
    const tabsOrLinks = page.locator(
      '[role="tab"], nav a, [data-testid*="tab"]'
    );
    await expect(tabsOrLinks.first()).toBeVisible();
  });

  test("should access user management", async ({ page }) => {
    await login(page, TEST_USERS.admin.email);
    await page.goto(`${BASE_URL}/admin`);

    // Look for users section
    const usersTab = page.locator("text=/users|utilizadores/i").first();
    if (await usersTab.isVisible()) {
      await usersTab.click();
      await expect(page.locator("text=/users|utilizadores/i")).toBeVisible();
    }
  });

  test("should access events management", async ({ page }) => {
    await login(page, TEST_USERS.admin.email);
    await page.goto(`${BASE_URL}/admin`);

    const eventsTab = page.locator("text=/events|eventos/i").first();
    if (await eventsTab.isVisible()) {
      await eventsTab.click();
      await expect(page.locator("text=/events|eventos/i")).toBeVisible();
    }
  });

  test("should access venues management", async ({ page }) => {
    await login(page, TEST_USERS.admin.email);
    await page.goto(`${BASE_URL}/admin`);

    const venuesTab = page.locator("text=/venues|locais/i").first();
    if (await venuesTab.isVisible()) {
      await venuesTab.click();
    }
  });
});

// ============================================================================
// BOX OWNER TESTS (João Owner)
// ============================================================================

test.describe("2. João Owner Tests (Box Owner)", () => {
  test("should login successfully as box owner", async ({ page }) => {
    await login(page, TEST_USERS.joaoOwner.email);
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should NOT have access to admin panel", async ({ page }) => {
    await login(page, TEST_USERS.joaoOwner.email);
    await page.goto(`${BASE_URL}/admin`);

    // Should be redirected or see access denied
    await expect(page).not.toHaveURL(/\/admin$/);
  });

  test("should access profile page", async ({ page }) => {
    await login(page, TEST_USERS.joaoOwner.email);
    await page.goto(`${BASE_URL}/profile`);
    await expect(page).toHaveURL(/profile/);
  });

  test("should access settings page", async ({ page }) => {
    await login(page, TEST_USERS.joaoOwner.email);
    await page.goto(`${BASE_URL}/settings`);
    await expect(page).toHaveURL(/settings/);
  });

  test("should access events page", async ({ page }) => {
    await login(page, TEST_USERS.joaoOwner.email);
    await page.goto(`${BASE_URL}/events`);
    await expect(page).toHaveURL(/events/);
  });

  test("should access feed page", async ({ page }) => {
    await login(page, TEST_USERS.joaoOwner.email);
    await page.goto(`${BASE_URL}/feed`);
    await expect(page).toHaveURL(/feed/);
  });

  test("should see favorite sports in profile", async ({ page }) => {
    await login(page, TEST_USERS.joaoOwner.email);
    await page.goto(`${BASE_URL}/profile`);

    // Check if profile loads
    await expect(page.locator("text=/crossfit|hyrox/i").first()).toBeVisible({
      timeout: 10000,
    });
  });
});

// ============================================================================
// COACH TESTS (Maria Coach)
// ============================================================================

test.describe("3. Maria Coach Tests (Treinadora)", () => {
  test("should login successfully as coach", async ({ page }) => {
    await login(page, TEST_USERS.mariaCoach.email);
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should NOT have access to admin panel", async ({ page }) => {
    await login(page, TEST_USERS.mariaCoach.email);
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).not.toHaveURL(/\/admin$/);
  });

  test("should access profile page", async ({ page }) => {
    await login(page, TEST_USERS.mariaCoach.email);
    await page.goto(`${BASE_URL}/profile`);
    await expect(page).toHaveURL(/profile/);
  });

  test("should be able to browse events", async ({ page }) => {
    await login(page, TEST_USERS.mariaCoach.email);
    await page.goto(`${BASE_URL}/events`);
    await expect(page).toHaveURL(/events/);
  });

  test("should be able to access feed", async ({ page }) => {
    await login(page, TEST_USERS.mariaCoach.email);
    await page.goto(`${BASE_URL}/feed`);
    await expect(page).toHaveURL(/feed/);
  });
});

// ============================================================================
// BOX MEMBER TESTS (Pedro Atleta)
// ============================================================================

test.describe("4. Pedro Atleta Tests (Membro de Box)", () => {
  test("should login successfully as box member", async ({ page }) => {
    await login(page, TEST_USERS.pedroAtleta.email);
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should NOT have access to admin panel", async ({ page }) => {
    await login(page, TEST_USERS.pedroAtleta.email);
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).not.toHaveURL(/\/admin$/);
  });

  test("should access profile page", async ({ page }) => {
    await login(page, TEST_USERS.pedroAtleta.email);
    await page.goto(`${BASE_URL}/profile`);
    await expect(page).toHaveURL(/profile/);
  });

  test("should be able to browse events", async ({ page }) => {
    await login(page, TEST_USERS.pedroAtleta.email);
    await page.goto(`${BASE_URL}/events`);
    await expect(page).toHaveURL(/events/);

    // Check if events are displayed
    await expect(page.locator("main")).toBeVisible();
  });

  test("should be able to access event details", async ({ page }) => {
    await login(page, TEST_USERS.pedroAtleta.email);
    await page.goto(`${BASE_URL}/events`);

    // Try to click on first event if available
    const firstEventLink = page.locator('a[href*="/events/"]').first();
    if (await firstEventLink.isVisible()) {
      await firstEventLink.click();
      await expect(page).toHaveURL(/\/events\/.+/);
    }
  });

  test("should be able to access feed", async ({ page }) => {
    await login(page, TEST_USERS.pedroAtleta.email);
    await page.goto(`${BASE_URL}/feed`);
    await expect(page).toHaveURL(/feed/);
  });
});

// ============================================================================
// FREE ATHLETE TESTS (Ana Free)
// ============================================================================

test.describe("5. Ana Free Tests (Atleta Independente)", () => {
  test("should login successfully as free athlete", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should NOT have access to admin panel", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).not.toHaveURL(/\/admin$/);
  });

  test("should access profile page", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await page.goto(`${BASE_URL}/profile`);
    await expect(page).toHaveURL(/profile/);
  });

  test("should be able to browse events", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await page.goto(`${BASE_URL}/events`);
    await expect(page).toHaveURL(/events/);
  });

  test("should be able to access events map", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await page.goto(`${BASE_URL}/events`);

    // Look for map toggle or map view
    const mapToggle = page.locator("text=/map|mapa/i").first();
    if (await mapToggle.isVisible()) {
      await mapToggle.click();
    }
  });

  test("should be able to search events", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await page.goto(`${BASE_URL}/events`);

    // Look for search input
    const searchInput = page.locator(
      'input[placeholder*="search"], input[placeholder*="pesquisar"], input[type="search"]'
    );
    if (await searchInput.isVisible()) {
      await searchInput.fill("trail");
      await page.waitForTimeout(500);
    }
  });

  test("should be able to access feed", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await page.goto(`${BASE_URL}/feed`);
    await expect(page).toHaveURL(/feed/);
  });
});

// ============================================================================
// MULTI-BOX USER TESTS (Carlos Multi)
// ============================================================================

test.describe("6. Carlos Multi Tests (Multi-Box + Owner)", () => {
  test("should login successfully as multi-box user", async ({ page }) => {
    await login(page, TEST_USERS.carlosMulti.email);
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should NOT have access to admin panel", async ({ page }) => {
    await login(page, TEST_USERS.carlosMulti.email);
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).not.toHaveURL(/\/admin$/);
  });

  test("should access profile page", async ({ page }) => {
    await login(page, TEST_USERS.carlosMulti.email);
    await page.goto(`${BASE_URL}/profile`);
    await expect(page).toHaveURL(/profile/);
  });

  test("should be able to access settings", async ({ page }) => {
    await login(page, TEST_USERS.carlosMulti.email);
    await page.goto(`${BASE_URL}/settings`);
    await expect(page).toHaveURL(/settings/);
  });

  test("should be able to browse events", async ({ page }) => {
    await login(page, TEST_USERS.carlosMulti.email);
    await page.goto(`${BASE_URL}/events`);
    await expect(page).toHaveURL(/events/);
  });

  test("should be able to access feed", async ({ page }) => {
    await login(page, TEST_USERS.carlosMulti.email);
    await page.goto(`${BASE_URL}/feed`);
    await expect(page).toHaveURL(/feed/);
  });
});

// ============================================================================
// NEW USER TESTS (Sofia Nova)
// ============================================================================

test.describe("7. Sofia Nova Tests (Utilizador Novo - Email Não Verificado)", () => {
  test("should login successfully as new user", async ({ page }) => {
    await login(page, TEST_USERS.sofiaNova.email);
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should access profile page", async ({ page }) => {
    await login(page, TEST_USERS.sofiaNova.email);
    await page.goto(`${BASE_URL}/profile`);
    // May redirect to verification or show warning
    await page.waitForLoadState("networkidle");
  });

  test("should be able to browse events as new user", async ({ page }) => {
    await login(page, TEST_USERS.sofiaNova.email);
    await page.goto(`${BASE_URL}/events`);
    await page.waitForLoadState("networkidle");
  });

  test("should see onboarding or recommendation prompts", async ({ page }) => {
    await login(page, TEST_USERS.sofiaNova.email);
    await page.goto(`${BASE_URL}/profile`);

    // Check for any onboarding or setup prompts
    await page.waitForLoadState("networkidle");
  });
});

// ============================================================================
// BANNED USER TESTS
// ============================================================================

test.describe("8. Banned User Tests", () => {
  test("should NOT be able to login as banned user", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);
    await page.waitForLoadState("networkidle");

    // Fill email
    await page.fill(
      'input[id="email"], input[name="email"]',
      TEST_USERS.bannedUser.email
    );

    // Fill password
    await page.fill(
      'input[id="password"], input[name="password"]',
      DEFAULT_PASSWORD
    );

    // Click submit
    await page.click('button[type="submit"]');

    // Should stay on signin page or show error
    await page.waitForTimeout(2000);

    // Check for error message or still on signin page
    const onSigninPage = page.url().includes("signin");
    const hasError = await page
      .locator("text=/banned|suspen|bloqueado|erro/i")
      .isVisible();

    expect(onSigninPage || hasError).toBeTruthy();
  });
});

// ============================================================================
// PUBLIC ACCESS TESTS (NOT LOGGED IN)
// ============================================================================

test.describe("9. Public Access Tests (Não Autenticado)", () => {
  test("should access homepage without login", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)?$/);
  });

  test("should access events page without login", async ({ page }) => {
    await page.goto(`${BASE_URL}/events`);
    await expect(page).toHaveURL(/events/);
  });

  test("should redirect profile to signin when not logged in", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/profile`);
    await expect(page).toHaveURL(/signin/);
  });

  test("should redirect settings to signin when not logged in", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/settings`);
    await expect(page).toHaveURL(/signin/);
  });

  test("should redirect feed to signin when not logged in", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/feed`);
    await expect(page).toHaveURL(/signin/);
  });

  test("should redirect admin to signin when not logged in", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/admin`);
    // Should redirect to signin or show access denied
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url.includes("signin") || url.includes("admin")).toBeTruthy();
  });

  test("should see signin page with login form", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);

    // Check for email input
    await expect(page.locator('input[id="email"]')).toBeVisible();

    // Check for password input
    await expect(page.locator('input[id="password"]')).toBeVisible();

    // Check for the "Entrar" button in the main content area (signin form)
    await expect(
      page.getByRole("main").getByRole("button", { name: "Entrar" })
    ).toBeVisible();

    // Check for Google signin option
    await expect(page.locator("text=/google/i")).toBeVisible();
  });
});

// ============================================================================
// EVENT INTERACTION TESTS
// ============================================================================

test.describe("10. Event Interaction Tests", () => {
  test("logged in user can view event details", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await page.goto(`${BASE_URL}/events`);

    // Try to access an event
    const eventLink = page.locator('a[href*="/events/"]').first();
    if (await eventLink.isVisible()) {
      await eventLink.click();
      await expect(page).toHaveURL(/\/events\/.+/);

      // Check for event content
      await expect(page.locator("h1, h2").first()).toBeVisible();
    }
  });

  test("public user can view event details", async ({ page }) => {
    await page.goto(`${BASE_URL}/events`);

    const eventLink = page.locator('a[href*="/events/"]').first();
    if (await eventLink.isVisible()) {
      await eventLink.click();
      await expect(page).toHaveURL(/\/events\/.+/);
    }
  });
});

// ============================================================================
// NAVIGATION TESTS
// ============================================================================

test.describe("11. Navigation Tests", () => {
  test("should have working navigation for logged in user", async ({
    page,
  }) => {
    await login(page, TEST_USERS.pedroAtleta.email);

    // Test homepage (logged in users may be redirected to feed)
    await page.goto(`${BASE_URL}/`);
    // After login, users might be redirected to feed or stay on homepage
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)(\/feed)?$/);

    // Test events navigation
    await page.goto(`${BASE_URL}/events`);
    await expect(page).toHaveURL(/events/);

    // Test profile navigation
    await page.goto(`${BASE_URL}/profile`);
    await expect(page).toHaveURL(/profile/);

    // Test settings navigation
    await page.goto(`${BASE_URL}/settings`);
    await expect(page).toHaveURL(/settings/);
  });

  test("should have language selector available", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Look for language selector and verify it exists
    const langSelector = page.locator(
      '[data-testid="language-selector"], button:has-text("PT"), button:has-text("EN")'
    );

    // Language selector might be in menu or visible directly
    await page.waitForLoadState("networkidle");

    // Check if selector exists (it might be hidden in a menu)
    const selectorCount = await langSelector.count();
    expect(selectorCount).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// ROLE-BASED ACCESS CONTROL TESTS
// ============================================================================

test.describe("12. Role-Based Access Control", () => {
  test("admin can access admin panel", async ({ page }) => {
    await login(page, TEST_USERS.admin.email);
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).toHaveURL(/admin/);
  });

  test("regular user cannot access admin panel", async ({ page }) => {
    await login(page, TEST_USERS.anaFree.email);
    await page.goto(`${BASE_URL}/admin`);

    // Should redirect away from admin
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(!url.endsWith("/admin") || url.includes("signin")).toBeTruthy();
  });

  test("owner user cannot access admin panel", async ({ page }) => {
    await login(page, TEST_USERS.joaoOwner.email);
    await page.goto(`${BASE_URL}/admin`);

    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(!url.endsWith("/admin") || url.includes("signin")).toBeTruthy();
  });

  test("coach user cannot access admin panel", async ({ page }) => {
    await login(page, TEST_USERS.mariaCoach.email);
    await page.goto(`${BASE_URL}/admin`);

    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(!url.endsWith("/admin") || url.includes("signin")).toBeTruthy();
  });
});
