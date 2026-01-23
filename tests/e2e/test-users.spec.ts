import { test, expect, type Page } from "@playwright/test";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Helper function para login
async function login(page: Page, email: string, password: string = "Test123!") {
  await page.goto(`${BASE_URL}/auth/signin`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/(?!.*signin)/);
}

test.describe("App Admin Tests", () => {
  test("should login successfully as app admin", async ({ page }) => {
    await login(page, "admin@athlifyr.com");
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should access admin panel", async ({ page }) => {
    await login(page, "admin@athlifyr.com");
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator("h1")).toContainText(/admin|administr/i);
  });

  test("should see all admin tabs", async ({ page }) => {
    await login(page, "admin@athlifyr.com");
    await page.goto(`${BASE_URL}/admin`);

    // Verificar se todos os tabs do admin estão visíveis
    await expect(
      page.locator('[role="tab"]').filter({ hasText: /events|eventos/i })
    ).toBeVisible();
    await expect(
      page.locator('[role="tab"]').filter({ hasText: /venues|locais/i })
    ).toBeVisible();
    await expect(
      page.locator('[role="tab"]').filter({ hasText: /users|utilizadores/i })
    ).toBeVisible();
    await expect(
      page.locator('[role="tab"]').filter({ hasText: /contacts|contactos/i })
    ).toBeVisible();
  });
});

test.describe("Gym Owner Tests", () => {
  test("should login successfully as gym owner", async ({ page }) => {
    await login(page, "owner@testgym.com");
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should access test venue", async ({ page }) => {
    await login(page, "owner@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);
    await expect(page.locator("h1")).toContainText(/Test Gym CrossFit/i);
  });

  test("should see Team tab", async ({ page }) => {
    await login(page, "owner@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Verificar se o tab Team está visível
    const teamTab = page
      .locator('[role="tab"]')
      .filter({ hasText: /team|equipa/i });
    await expect(teamTab).toBeVisible();
  });

  test("should be able to edit venue", async ({ page }) => {
    await login(page, "owner@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Verificar se o botão de editar está visível
    const editButton = page
      .locator("button")
      .filter({ hasText: /edit|editar/i });
    await expect(editButton.first()).toBeVisible();
  });

  test("should be able to reply to reviews", async ({ page }) => {
    await login(page, "owner@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Abrir modal de reviews
    await page.click(
      'button:has-text("Avaliações"), button:has-text("Reviews")'
    );

    // Verificar se pode responder (verifica se não há mensagem de admin only)
    await expect(page.locator("text=/only.*admin/i")).not.toBeVisible();
  });
});

test.describe("Gym Admin Tests", () => {
  test("should login successfully as gym admin", async ({ page }) => {
    await login(page, "admin@testgym.com");
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should see Team tab", async ({ page }) => {
    await login(page, "admin@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    const teamTab = page
      .locator('[role="tab"]')
      .filter({ hasText: /team|equipa/i });
    await expect(teamTab).toBeVisible();
  });

  test("should not be able to delete venue", async ({ page }) => {
    await login(page, "admin@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Admin não deve ver botão de eliminar
    const deleteButton = page
      .locator("button")
      .filter({ hasText: /delete|eliminar|apagar/i });
    await expect(deleteButton).not.toBeVisible();
  });
});

test.describe("Gym Coach Tests", () => {
  test("should login successfully as gym coach", async ({ page }) => {
    await login(page, "coach@testgym.com");
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should NOT see Team tab", async ({ page }) => {
    await login(page, "coach@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    const teamTab = page
      .locator('[role="tab"]')
      .filter({ hasText: /team|equipa/i });
    await expect(teamTab).not.toBeVisible();
  });

  test("should see venue publicly", async ({ page }) => {
    await login(page, "coach@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Deve ver o nome do venue
    await expect(page.locator("h1")).toContainText(/Test Gym CrossFit/i);

    // Deve ver tabs públicos
    await expect(
      page.locator('[role="tab"]').filter({ hasText: /feed/i })
    ).toBeVisible();
    await expect(
      page.locator('[role="tab"]').filter({ hasText: /about/i })
    ).toBeVisible();
  });

  test("should NOT be able to edit venue", async ({ page }) => {
    await login(page, "coach@testgym.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    const editButton = page
      .locator("button")
      .filter({ hasText: /edit|editar/i });
    await expect(editButton).not.toBeVisible();
  });
});

test.describe("Free User Tests", () => {
  test("should login successfully as free user", async ({ page }) => {
    await login(page, "user.free@test.com");
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should NOT see Team tab", async ({ page }) => {
    await login(page, "user.free@test.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    const teamTab = page
      .locator('[role="tab"]')
      .filter({ hasText: /team|equipa/i });
    await expect(teamTab).not.toBeVisible();
  });

  test("should be able to write reviews", async ({ page }) => {
    await login(page, "user.free@test.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Abrir modal de reviews
    await page.click(
      'button:has-text("Avaliações"), button:has-text("Reviews")'
    );

    // Verificar se pode escrever review
    const reviewTextarea = page.locator(
      'textarea[placeholder*="avaliação"], textarea[placeholder*="review"]'
    );
    await expect(reviewTextarea).toBeVisible();
  });

  test("should be able to recommend venue", async ({ page }) => {
    await login(page, "user.free@test.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Verificar se o botão de recomendar está visível
    const recommendButton = page
      .locator("button")
      .filter({ hasText: /recomendar|recommend/i });
    await expect(recommendButton.first()).toBeVisible();
  });

  test("should see subscribe buttons on plans", async ({ page }) => {
    await login(page, "user.free@test.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Ir para tab de plans
    await page.click(
      '[role="tab"]:has-text("Plans"), [role="tab"]:has-text("Planos")'
    );

    // Deve ver botão de subscrever
    await expect(
      page.locator("button").filter({ hasText: /subscribe|subscrever/i })
    ).toBeVisible();
  });
});

test.describe("Premium User Tests", () => {
  test("should login successfully as premium user", async ({ page }) => {
    await login(page, "user.premium@test.com");
    await expect(page).toHaveURL(/\/(pt|en|es|fr|de|it)/);
  });

  test("should NOT see Team tab", async ({ page }) => {
    await login(page, "user.premium@test.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    const teamTab = page
      .locator('[role="tab"]')
      .filter({ hasText: /team|equipa/i });
    await expect(teamTab).not.toBeVisible();
  });

  test("should see active subscription", async ({ page }) => {
    await login(page, "user.premium@test.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Ir para tab de plans
    await page.click(
      '[role="tab"]:has-text("Plans"), [role="tab"]:has-text("Planos")'
    );

    // Deve ver indicação de subscrição ativa
    await expect(page.locator("text=/active|ativa/i")).toBeVisible();
  });

  test("should be able to book sessions", async ({ page }) => {
    await login(page, "user.premium@test.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Ir para tab de sessions
    await page.click(
      '[role="tab"]:has-text("Sessions"), [role="tab"]:has-text("Sessões")'
    );

    // Deve ver botão de booking
    const bookButton = page
      .locator("button")
      .filter({ hasText: /book|reservar|marcar/i });
    await expect(bookButton.first()).toBeVisible();
  });

  test("should see full venue feed", async ({ page }) => {
    await login(page, "user.premium@test.com");
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Tab feed deve estar visível e ser o default
    await expect(page.locator('[role="tabpanel"]').first()).toBeVisible();
  });
});

test.describe("Public Access (Not Logged In)", () => {
  test("should see venue publicly without login", async ({ page }) => {
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);
    await expect(page.locator("h1")).toContainText(/Test Gym CrossFit/i);
  });

  test("should NOT see Team tab when not logged in", async ({ page }) => {
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    const teamTab = page
      .locator('[role="tab"]')
      .filter({ hasText: /team|equipa/i });
    await expect(teamTab).not.toBeVisible();
  });

  test("should see login prompt for reviews", async ({ page }) => {
    await page.goto(`${BASE_URL}/venues/test-gym-crossfit`);

    // Abrir modal de reviews
    await page.click(
      'button:has-text("Avaliações"), button:has-text("Reviews")'
    );

    // Deve ver mensagem de login necessário
    await expect(
      page.locator("text=/login|autenticação|sign in/i")
    ).toBeVisible();
  });
});
