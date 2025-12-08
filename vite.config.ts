import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

const root = resolve(__dirname, "src");

export default defineConfig({
  plugins: [react(), TanStackRouterVite(), glsl()],

  build: {
    outDir: resolve(__dirname, "public"),
  },

  resolve: {
    alias: {
      components: resolve(root, "components"),
      types: resolve(root, "types"),
      utils: resolve(root, "utils"),
      styles: resolve(root, "styles"),
      assets: resolve(root, "assets"),
      pages: resolve(root, "pages"),
    },
  },
});
