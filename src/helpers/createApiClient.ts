import { API_CONFIG } from "constants/index";

export const createApiClient = () => {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (API_CONFIG.TOKEN) {
    headers.Authorization = `Bearer ${API_CONFIG.TOKEN}`;
  }

  return {
    fetch: async (url: string) => {
      const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(error.message || "Network response was not ok");
      }

      return response.json();
    },
  };
};
