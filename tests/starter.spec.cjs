const { test, expect } = require("@playwright/test");

const routes = [
  "/",
  "/about/",
  "/services/",
  "/gallery/",
  "/contact/",
  "/schedule-tour/",
  "/privacy-policy/",
  "/terms/",
];

test("all starter pages return 200 and avoid mobile horizontal scroll", async ({ page, request }) => {
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    await page.goto(route);
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasHorizontalScroll, route).toBe(false);
  }
});

test("mobile hamburger navigation opens", async ({ page }) => {
  await page.goto("/");
  await page.locator(".mobile-menu-toggle").click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await expect(page.locator("#mobile-menu")).toHaveClass(/is-open/);
});

test("forms render correctly", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.locator("form input[name='name']")).toBeVisible();
  await expect(page.locator("form textarea[name='message']")).toBeVisible();

  await page.goto("/schedule-tour/");
  await expect(page.locator("form input[name='preferredDate']")).toBeVisible();
  await expect(page.locator("form input[name='phone']")).toBeVisible();
});

test("gallery lightbox works", async ({ page }) => {
  await page.goto("/gallery/");
  await page.locator("main picture img").first().click();
  await expect(page.locator(".image-lightbox")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".image-lightbox")).toBeHidden();
});

test("placeholder social preview loads", async ({ request }) => {
  const response = await request.get("/assets/social/social-preview.svg");
  expect(response.status()).toBe(200);
});
