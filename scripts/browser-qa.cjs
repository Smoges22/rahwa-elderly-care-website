const { chromium } = require("playwright");

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:4173";
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

(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const results = [];

  for (const route of routes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    results.push(`${route} ${response.status()}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) throw new Error(`Horizontal scroll detected on ${route}`);
  }

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.click(".mobile-menu-toggle");
  const menuOpen = await page.locator("#mobile-menu").evaluate((node) => !node.hidden && node.classList.contains("is-open"));
  if (!menuOpen) throw new Error("Mobile hamburger menu did not open.");

  await page.goto(`${baseUrl}/gallery/`, { waitUntil: "networkidle" });
  await page.click("main picture img");
  const lightboxOpen = await page.locator(".image-lightbox").evaluate((node) => !node.hidden);
  if (!lightboxOpen) throw new Error("Lightbox did not open.");
  await page.keyboard.press("Escape");

  await page.goto(`${baseUrl}/contact/`, { waitUntil: "networkidle" });
  if ((await page.locator("form input[name='name']").count()) !== 1) throw new Error("Contact form name field missing.");
  if ((await page.locator("form textarea[name='message']").count()) !== 1) throw new Error("Contact form message field missing.");

  await page.goto(`${baseUrl}/schedule-tour/`, { waitUntil: "networkidle" });
  if ((await page.locator("form input[name='preferredDate']").count()) !== 1) throw new Error("Schedule tour date field missing.");

  const socialResponse = await page.goto(`${baseUrl}/assets/social/social-preview.svg`);
  if (socialResponse.status() !== 200) throw new Error("Social preview did not load.");

  await browser.close();
  console.log(results.join("\n"));
  console.log("Mobile hamburger works.");
  console.log("Forms render correctly.");
  console.log("Lightbox works.");
  console.log("No horizontal scroll detected on mobile viewport.");
  console.log("Placeholder social preview loads.");
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
