import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const backEndPort = "http://localhost:3000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/user": `${backEndPort}/api`,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
