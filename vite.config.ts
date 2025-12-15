import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { mergeConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { defineConfig } from "vitest/config";

const root = resolve(__dirname, "src");

const viteConfig = {
  plugins: [react(), TanStackRouterVite(), glsl()],
  build: {
    outDir: resolve(__dirname, "public"),
  },
  resolve: {
    alias: {
      components: resolve(root, "components"),
      constants: resolve(root, "constants"),
      helpers: resolve(root, "helpers"),
      types: resolve(root, "types"),
      utils: resolve(root, "utils"),
      styles: resolve(root, "styles"),
      assets: resolve(root, "assets"),
      pages: resolve(root, "pages"),
    },
  },
};

const testConfig = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
};

export default defineConfig(mergeConfig(viteConfig, testConfig));
