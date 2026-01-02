import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Must be "dist" for Vercel to detect
  },
  base: "/",
  server: {
    historyApiFallback: true, // SPA routing for dev
  },
});
