import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "static",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
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
