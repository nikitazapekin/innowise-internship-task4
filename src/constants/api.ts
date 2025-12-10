export const API_CONFIG = {
  BASE_URL: import.meta.env?.VITE_GITHUB_API_URL || "https://api.github.com",
  TOKEN: import.meta.env?.VITE_GITHUB_TOKEN || "",
  DEFAULT_PER_PAGE: 10,
} as const;

export const PER_PAGE_OPTIONS = [5, 10, 20, 30, 50] as const;
