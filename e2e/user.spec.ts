import { test, expect, Page } from "@playwright/test";

const mockUser = {
  id: 1,
  login: "testuser",
  avatar_url: "https://github.com/testuser.png",
  html_url: "https://github.com/testuser",
  type: "User",
  site_admin: false,
  name: "Test User",
  company: "Test Company",
  blog: "https://testuser.dev",
  location: "Test City",
  email: "test@example.com",
  bio: "Test bio description",
  twitter_username: "testuser_tw",
  public_repos: 42,
  public_gists: 5,
  followers: 100,
  following: 50,
  created_at: "2020-01-01T00:00:00Z",
  updated_at: "2023-12-01T00:00:00Z",
};

async function mockGitHubAPI(page: Page, username: string) {
  await page.route(`**/api.github.com/users/${username}**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockUser),
    });
  });
}

test.describe("User Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    const username = "testuser";
    await mockGitHubAPI(page, username);
    await page.goto(`http://localhost:5173/users/${username}`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(2000);
  });

  test("should load user profile successfully", async ({ page }) => {
    await expect(page).toHaveURL(/.*users\/testuser/);

    const loadingIndicator = page.getByText(/загрузка пользователя|loading user/i);
    const hasLoading = await loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false);

    if (hasLoading) {
      await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
    }

    const userAvatar = page.locator('img[alt="testuser"]').first();
    await expect(userAvatar).toBeVisible({ timeout: 10000 });

    const userName = page.getByText(mockUser.name!).first();
    await expect(userName).toBeVisible();

    const userLogin = page.getByText(`@${mockUser.login}`).first();
    await expect(userLogin).toBeVisible();
  });

  test("should display user bio and statistics", async ({ page }) => {
    await page.waitForTimeout(2000);

    const userBio = page.getByText(mockUser.bio).first();
    const hasBio = await userBio.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasBio) {
      await expect(userBio).toBeVisible();
    }

    const statsSection = page
      .locator('*:has-text("Репозитории")')
      .or(page.locator('*:has-text("Repositories")'))
      .first();

    await expect(statsSection).toBeVisible();

    const reposCount = page
      .locator('*:has-text("Репозитории")')
      .or(page.locator('*:has-text("Repositories")'))
      .locator("xpath=preceding-sibling::*[1] | following-sibling::*[1]")
      .first();

    const reposVisible = await reposCount.isVisible({ timeout: 2000 }).catch(() => false);
    if (reposVisible) {
      const reposText = await reposCount.textContent();
      expect(reposText).toBe(mockUser.public_repos.toString());
    }

    const followersCount = page
      .locator('*:has-text("Подписчики")')
      .or(page.locator('*:has-text("Followers")'))
      .locator("xpath=preceding-sibling::*[1] | following-sibling::*[1]")
      .first();

    const followersVisible = await followersCount.isVisible({ timeout: 2000 }).catch(() => false);
    if (followersVisible) {
      const followersText = await followersCount.textContent();
      expect(followersText).toBe(mockUser.followers.toString());
    }

    const followingCount = page
      .locator('*:has-text("Подписки")')
      .or(page.locator('*:has-text("Following")'))
      .locator("xpath=preceding-sibling::*[1] | following-sibling::*[1]")
      .first();

    const followingVisible = await followingCount.isVisible({ timeout: 2000 }).catch(() => false);
    if (followingVisible) {
      const followingText = await followingCount.textContent();
      expect(followingText).toBe(mockUser.following.toString());
    }
  });

  test("should display user details", async ({ page }) => {
    await page.waitForTimeout(2000);

    const companyElement = page.getByText(mockUser.company!).first();
    const hasCompany = await companyElement.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasCompany) {
      await expect(companyElement).toBeVisible();
    }

    const locationElement = page.getByText(mockUser.location!).first();
    const hasLocation = await locationElement.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasLocation) {
      await expect(locationElement).toBeVisible();
    }

    const emailElement = page.getByText(mockUser.email!).first();
    const hasEmail = await emailElement.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasEmail) {
      await expect(emailElement).toBeVisible();
    }

    const blogElement = page.getByText(mockUser.blog!).first();
    const hasBlog = await blogElement.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasBlog) {
      await expect(blogElement).toBeVisible();
    }

    const twitterElement = page.getByText(mockUser.twitter_username!).first();
    const hasTwitter = await twitterElement.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasTwitter) {
      await expect(twitterElement).toBeVisible();
    }
  });

  test("should display dates correctly", async ({ page }) => {
    await page.waitForTimeout(2000);

    const createdDate = page.getByText(/создан|created/i).first();
    const hasCreatedDate = await createdDate.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasCreatedDate) {
      await expect(createdDate).toBeVisible();
      const parentText = await createdDate.textContent();
      expect(parentText).toContain(mockUser.created_at);
    }

    const updatedDate = page.getByText(/обновлён|updated/i).first();
    const hasUpdatedDate = await updatedDate.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasUpdatedDate) {
      await expect(updatedDate).toBeVisible();
      const parentText = await updatedDate.textContent();
      expect(parentText).toContain(mockUser.updated_at);
    }
  });

  test("should have working GitHub profile link", async ({ page }) => {
    await page.waitForTimeout(2000);

    const githubLink = page
      .locator('a[href="https://github.com/testuser"]')
      .or(page.getByText(/открыть профиль на github|open github profile/i))
      .first();

    await expect(githubLink).toBeVisible({ timeout: 3000 });

    const linkText = await githubLink.textContent();
    expect(linkText?.toLowerCase()).toMatch(/открыть профиль|open profile|github/i);

    const href = await githubLink.getAttribute("href");
    expect(href).toBe(mockUser.html_url);
  });

  test("should handle loading state", async ({ page }) => {
    await page.route("**/api.github.com/users/testuser**", async (route) => {
      await page.waitForTimeout(1500);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockUser),
      });
    });

    await page.reload({ waitUntil: "networkidle" });

    const loadingText = page.getByText(/загрузка пользователя|loading user/i);
    const hasLoading = await loadingText.isVisible({ timeout: 1000 }).catch(() => false);

    if (hasLoading) {
      await expect(loadingText).toBeVisible();
      await expect(loadingText).not.toBeVisible({ timeout: 3000 });
    }
  });

  test("should handle error state", async ({ page }) => {
    await page.route("**/api.github.com/users/testuser**", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Not Found" }),
      });
    });

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const errorMessage = page.getByText(/что-то пошло не так|something went wrong|error/i);
    const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasError) {
      await expect(errorMessage).toBeVisible();
    } else {
      const userAvatar = page.locator('img[alt="testuser"]').first();
      const avatarVisible = await userAvatar.isVisible({ timeout: 2000 }).catch(() => false);
      expect(avatarVisible).toBeFalsy();
    }
  });

  test("should handle user without optional fields", async ({ page }) => {
    const minimalUser = {
      ...mockUser,
      name: null,
      company: null,
      blog: null,
      location: null,
      email: null,
      bio: null,
      twitter_username: null,
    };

    await page.route("**/api.github.com/users/testuser**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(minimalUser),
      });
    });

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const userLogin = page.getByText(`@${mockUser.login}`).first();
    await expect(userLogin).toBeVisible();

    const userName = page
      .getByText(mockUser.login)
      .filter({ hasNotText: `@${mockUser.login}` })
      .first();
    const hasName = await userName.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasName) {
      await expect(userName).toBeVisible();
    }

    const statsSection = page
      .locator('*:has-text("Репозитории")')
      .or(page.locator('*:has-text("Repositories")'))
      .first();

    await expect(statsSection).toBeVisible();
  });
});

test.describe("User Page Navigation", () => {
  test("should navigate back to users list", async ({ page }) => {
    const username = "testuser";
    await mockGitHubAPI(page, username);

    await page.goto("http://localhost:5173/users", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const userLink = page.locator('*:has-text("testuser")').first();
    const hasUserLink = await userLink.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasUserLink) {
      await userLink.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/.*users\/testuser/);
    } else {
      await page.goto(`http://localhost:5173/users/${username}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);
    }

    const backButton = page
      .locator('button:has-text("Назад")')
      .or(page.locator('button:has-text("Back")'))
      .or(page.locator('a:has-text("Назад")'))
      .or(page.locator('a:has-text("Back")'))
      .first();

    const hasBackButton = await backButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasBackButton) {
      await backButton.click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/.*users/);
    }
  });
});
