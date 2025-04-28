import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  publicDir: path.resolve(__dirname, "public"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
