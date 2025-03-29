import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "unenv";

export default defineConfig({
  server: {
    preset: "cloudflare-pages",
    unenv: {
      ...cloudflare,
      external: ["node:async_hooks", ...(cloudflare.external || [])],
    },
    experimental: {
      asyncContext: true,
    },
  },
  tsr: {
    appDirectory: "src",
    autoCodeSplitting: true,
  },
  vite: {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },
});
