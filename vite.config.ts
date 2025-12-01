import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "public");

export default defineConfig({
  plugins: [react(), TanStackRouterVite(), glsl()],

  build: {
    outDir: outDir,
  },

  resolve: {
    alias: {
      components: resolve(root, "components"),
      types: resolve(root, "types"),
      utils: resolve(root, "utils"),

      assets: resolve(root, "assets"),
    },
  },
});
