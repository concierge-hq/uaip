/**
 * Vite config for widget builds.
 * Expects ENTRY_FILE and OUTPUT_NAME env vars.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";

const ENTRY_FILE = process.env.ENTRY_FILE;
const OUTPUT_NAME = process.env.OUTPUT_NAME;

if (!ENTRY_FILE || !OUTPUT_NAME) {
  throw new Error("ENTRY_FILE and OUTPUT_NAME env vars required.\nRun: npm run build");
}

export default defineConfig({
  plugins: [tailwindcss(), react(), viteSingleFile()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: ENTRY_FILE,
      output: {
        entryFileNames: `${OUTPUT_NAME}.js`,
        assetFileNames: `${OUTPUT_NAME}.[ext]`,
      },
    },
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
});
