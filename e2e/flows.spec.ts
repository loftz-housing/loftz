import { test, expect } from "@playwright/test";

// End-to-end user journeys against a production build. Email/DB side effects are
// mocked at the network layer so the booking flow never writes real data.

test("home → book-now → room detail", async ({ page }) => {
  await page.goto("/en");
  await expect(page).toHaveTitle(/LOFTZ/);

  // Go to the browse page via the header CTA.
  await page.getByRole("link", { name: /book now/i }).first().click();
  await expect(page).toHaveURL(/\/en\/book-now/);

  // Open the first room card.
  const firstRoom = page.locator('a[href*="/rooms/"]').first();
  await expect(firstRoom).toBeVisible();
  await firstRoom.click();
  await expect(page).toHaveURL(/\/en\/rooms\//);

  // Room detail shows the booking form + the sticky request affordance.
  await expect(page.locator("#request")).toBeVisible();
  await expect(page.getByRole("button", { name: /send booking request/i })).toBeVisible();
});

test("booking submit shows success (backend mocked)", async ({ page }) => {
  // Mock the API so no DB write / email is triggered.
  await page.route("**/api/requests", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "ok" }),
    })
  );

  await page.goto("/en/book-now");
  await page.locator('a[href*="/rooms/"]').first().click();
  await expect(page).toHaveURL(/\/en\/rooms\//);

  // Fill the booking form.
  await page.locator("#full_name").fill("E2E Tester");
  await page.locator("#email").fill("e2e@example.com");
  await page.locator("#check_in").fill("2027-03-01");
  await page.locator("#check_out").fill("2027-07-01");
  await page.locator('input[name="accept_rules"]').check();
  await page.locator('input[name="accept_privacy"]').check();

  await page.getByRole("button", { name: /send booking request/i }).click();

  // Success card renders.
  await expect(page.getByText(/request sent/i)).toBeVisible();
});

test("language switch to Portuguese", async ({ page }) => {
  await page.goto("/en");
  // Open the language switcher (button shows the current locale).
  await page.getByRole("button", { name: /^en/i }).first().click();
  await page.getByRole("option", { name: /Português/ }).click();
  await expect(page).toHaveURL(/\/pt(\/|$)/);
});

test("admin is gated behind login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);

  // A wrong password keeps us on the login page (error state).
  await page.locator('input[type="password"]').fill("definitely-wrong-password");
  await page.getByRole("button", { name: /(sign in|log in|enter|continue)/i }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
});
