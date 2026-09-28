import { test, expect } from "@playwright/test";

test("register, browse, add to cart, and reach checkout", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto("/register");
  await page.fill('input[name="name"]', "E2E Shopper");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "testpassword123");
  await Promise.all([page.waitForURL("/account"), page.click('button[type="submit"]')]);
  await expect(page.getByRole("heading", { name: "My account" })).toBeVisible();

  await page.goto("/category/microcontrollers-dev-boards");
  await expect(page.getByRole("heading", { name: "Microcontrollers & Dev Boards" })).toBeVisible();

  await page.goto("/product/voltrix-uno-32-dev-board");
  await expect(page.getByRole("heading", { name: "Voltrix UNO-32 Dev Board" })).toBeVisible();
  await page.getByRole("main").getByRole("button", { name: "Add to cart" }).click();

  await page.goto("/cart");
  await expect(page.getByText("Voltrix UNO-32 Dev Board")).toBeVisible();
  await expect(page.getByText("Total", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Proceed to checkout" }).click();
  await expect(page).toHaveURL("/checkout");
  await expect(page.getByRole("button", { name: "Pay with Stripe" })).toBeVisible();

  // With placeholder Stripe keys this should fail cleanly, not crash the app.
  await page.getByRole("button", { name: "Pay with Stripe" }).click();
  await expect(page.getByText(/Payment could not be started/i)).toBeVisible({ timeout: 10000 });
});

test("search finds a seeded product by name", async ({ page }) => {
  await page.goto("/search?q=breadboard");
  await expect(page.getByRole("heading", { name: /Results for/i })).toBeVisible();
  await expect(page.getByText("Voltrix 830-Point Breadboard")).toBeVisible();
});

test("unauthenticated visitor is redirected to login from checkout", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/login/);
});
