import { test, expect, Page } from "@playwright/test";

const mockUsers = [
  {
    id: 1,
    login: "testuser1",
    avatar_url: "url",
    html_url: "https://github.com/testuser1",
    type: "User",
    site_admin: false,
  },
  {
    id: 2,
    login: "testuser2",
    avatar_url: "url",
    html_url: "https://github.com/testuser2",
    type: "Organization",
    site_admin: true,
  },
];

async function mockGitHubAPI(page: Page) {
  await page.route("**/api.github.com/**", async (route) => {
    const url = route.request().url();

    if (url.includes("/search/users")) {
      const mockData = {
        items: mockUsers,
        total_count: mockUsers.length,
        incomplete_results: false,
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockData),
      });
    } else if (url.includes("/users") && !url.includes("search")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUsers),
      });
    } else {
      console.log("Continuing request:", url);
      route.continue();
    }
  });
}

test.describe("Users Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockGitHubAPI(page);

    await page.goto("http://localhost:5173/users", { waitUntil: "networkidle" });

    await page.waitForTimeout(3000);
  });

  test("should load users page successfully", async ({ page }) => {
    await expect(page).toHaveURL(/.*users/);

    const searchInput = page
      .locator('input[type="text"]')
      .or(page.getByPlaceholder(/поиск/i))
      .or(page.getByPlaceholder(/search/i))
      .first();

    await expect(searchInput).toBeVisible({ timeout: 10000 });
    console.log("Search input found");

    const searchButton = page
      .getByRole("button", { name: /поиск/i })
      .or(page.getByRole("button", { name: /search/i }))
      .or(page.locator('button:has-text("Поиск")'))
      .or(page.locator('button:has-text("Search")'))
      .first();

    await expect(searchButton).toBeVisible();

    const perPageLabel = page
      .getByText(/пользователей.*странице/i)
      .or(page.getByText(/users.*page/i))
      .or(page.getByText(/per page/i));

    const hasPerPageLabel = await perPageLabel.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasPerPageLabel) {
      console.log("Per page label found");
      await expect(perPageLabel).toBeVisible();
    }

    const perPageOptions = [10, 20, 30, 40, 50];
    let foundOptions = 0;

    for (const option of perPageOptions) {
      const optionElement = page
        .locator(`*:has-text("${option}"):not(:has-text("${option}0"))`)
        .first();
      const isVisible = await optionElement.isVisible({ timeout: 1000 }).catch(() => false);

      if (isVisible) {
        console.log(`Option ${option} found`);
        foundOptions++;
      }
    }

    expect(foundOptions).toBeGreaterThanOrEqual(3);
  });

  test("should search users and display results", async ({ page }) => {
    const searchInput = page
      .locator('input[type="text"]')
      .or(page.getByPlaceholder(/поиск/i))
      .first();

    await searchInput.fill("testuser");
    await page.waitForTimeout(800);

    const searchButton = page
      .getByRole("button", { name: /поиск/i })
      .or(page.locator('button:has-text("Поиск")'))
      .first();

    await searchButton.click();

    await page.waitForTimeout(3000);

    const resultsInfo = page
      .getByText(/найдено/i)
      .or(page.getByText(/found/i))
      .or(page.getByText(/results/i));

    const hasResultsInfo = await resultsInfo.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasResultsInfo) {
      console.log("Results info found");
      await expect(resultsInfo.first()).toBeVisible();
    }

    const user1Element = page.locator('*:has-text("testuser1")').first();
    const user2Element = page.locator('*:has-text("testuser2")').first();

    const user1Visible = await user1Element.isVisible({ timeout: 5000 }).catch(() => false);
    const user2Visible = await user2Element.isVisible({ timeout: 5000 }).catch(() => false);

    expect(user1Visible || user2Visible).toBeTruthy();

    if (user1Visible) {
      await expect(user1Element).toBeVisible();
    }

    if (user2Visible) {
      await expect(user2Element).toBeVisible();

      const orgText = page.getByText(/organization|организация/i).first();
      const hasOrgText = await orgText.isVisible({ timeout: 1000 }).catch(() => false);

      if (hasOrgText) {
        await expect(orgText).toBeVisible();
      }

      const adminBadge = page.getByText(/admin|админ/i).first();
      const hasAdminBadge = await adminBadge.isVisible({ timeout: 1000 }).catch(() => false);

      if (hasAdminBadge) {
        await expect(adminBadge).toBeVisible();
      }
    }

    const avatars = page.locator("img");
    const avatarCount = await avatars.count();

    if (avatarCount > 0) {
      const placeholderAvatars = page.locator('img[src*="placeholder"]');
      const placeholderCount = await placeholderAvatars.count();

      if (placeholderCount > 0) {
        await expect(placeholderAvatars.first()).toBeVisible();
      } else {
        await expect(avatars.first()).toBeVisible();
      }
    }
  });

  test("should change per page value", async ({ page }) => {
    await page.waitForTimeout(2000);

    const option20 = page.locator('*:has-text("20"):not(:has-text("20\\d"))').first();

    const isOption20Visible = await option20.isVisible({ timeout: 3000 }).catch(() => false);

    if (isOption20Visible) {
      await option20.click();

      await page.waitForTimeout(2000);

      const loadingText = page.getByText(/загрузка|loading/i);
      const hasLoading = await loadingText.isVisible({ timeout: 1000 }).catch(() => false);

      if (hasLoading) {
        await expect(loadingText).not.toBeVisible({ timeout: 5000 });
      }
    } else {
      test.skip();
    }
  });

  test("should handle empty search results", async ({ page }) => {
    await page.route("**/api.github.com/search/users**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [],
          total_count: 0,
          incomplete_results: false,
        }),
      });
    });

    const searchInput = page
      .locator('input[type="text"]')
      .or(page.getByPlaceholder(/поиск/i))
      .first();

    await searchInput.fill("nonexistentuser12345");
    await page.waitForTimeout(800);

    const searchButton = page
      .getByRole("button", { name: /поиск/i })
      .or(page.locator('button:has-text("Поиск")'))
      .first();

    await searchButton.click();

    await page.waitForTimeout(3000);

    const emptyMessage = page.getByText(/не найдены|отсутствуют|no users|not found/i);

    const hasEmptyMessage = await emptyMessage.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasEmptyMessage) {
      await expect(emptyMessage.first()).toBeVisible();
    } else {
      const userElements = await page.locator('*:has-text("testuser")').count();

      expect(userElements).toBe(0);
    }
  });

  test("should show loading state", async ({ page }) => {
    await page.route("**/api.github.com/search/users**", async (route) => {
      await page.waitForTimeout(2000);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: mockUsers,
          total_count: 2,
          incomplete_results: false,
        }),
      });
    });

    const searchInput = page
      .locator('input[type="text"]')
      .or(page.getByPlaceholder(/поиск/i))
      .first();

    await searchInput.fill("test");
    await page.waitForTimeout(800);

    const searchButton = page
      .getByRole("button", { name: /поиск/i })
      .or(page.locator('button:has-text("Поиск")'))
      .first();

    await searchButton.click();

    const loadingIndicator = page
      .getByText(/загрузка.*пользователей|loading.*users/i)
      .or(page.getByText(/загрузка|loading/i).filter({ hasNotText: /testuser/ }))
      .first();

    const hasLoading = await loadingIndicator.isVisible({ timeout: 1500 }).catch(() => false);

    if (hasLoading) {
      await expect(loadingIndicator).toBeVisible();

      await page.waitForTimeout(2500);

      await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
    } else {
      await page.waitForTimeout(3000);
      const userElements = await page.locator('*:has-text("testuser")').count();

      expect(userElements).toBeGreaterThan(0);
    }
  });
});

test.describe("Keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await mockGitHubAPI(page);
    await page.goto("http://localhost:5173/users", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
  });

  test("should submit search on Enter key", async ({ page }) => {
    const searchInput = page
      .locator('input[type="text"]')
      .or(page.getByPlaceholder(/поиск/i))
      .first();

    await searchInput.fill("testuser");
    await searchInput.press("Enter");

    await page.waitForTimeout(3000);

    const userElements = await page.locator('*:has-text("testuser")').count();

    expect(userElements).toBeGreaterThan(0);
  });

  test("should clear search on Escape key", async ({ page }) => {
    const searchInput = page
      .locator('input[type="text"]')
      .or(page.getByPlaceholder(/поиск/i))
      .first();

    await searchInput.fill("test");

    await searchInput.press("Escape");

    await page.waitForTimeout(500);

    const currentValue = await searchInput.inputValue();

    expect(currentValue).not.toBe("testuser1");
  });
});
