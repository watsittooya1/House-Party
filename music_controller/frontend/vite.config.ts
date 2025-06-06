import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    outDir: "static",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/App.tsx"),
      },
      output: {
        entryFileNames: "bundle.js",
      },
    },
  },
  optimizeDeps: {
    include: ["@emotion/styled"],
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
});
