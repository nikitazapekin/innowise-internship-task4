import { test } from "@playwright/test";

test("debug API calls", async ({ page }) => {
  page.on("request", (request) => {
    if (request.url().includes("github") || request.url().includes("api")) {
      console.log(" Request:", request.method(), request.url());
    }
  });

  page.on("response", (response) => {
    if (response.url().includes("github") || response.url().includes("api")) {
      console.log(" Response:", response.status(), response.url());
    }
  });

  await page.goto("http://localhost:5173/users");
  await page.waitForTimeout(3000);

  const searchInput = page.getByPlaceholder(/поиск/i);
  await searchInput.fill("testuser");
  await page.waitForTimeout(500);

  const searchButton = page.getByRole("button", { name: /поиск/i });
  await searchButton.click();

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "debug-search-results.png", fullPage: true });
});
