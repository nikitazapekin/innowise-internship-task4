/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_API_URL: string;
  readonly VITE_GITHUB_TOKEN: string;
  readonly VITE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
