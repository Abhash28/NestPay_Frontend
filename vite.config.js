import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build", // optional, default is dist
  },
  base: "/", // ensure base path is root
  server: {
    historyApiFallback: true, // important for SPA routing in dev
  },
});
