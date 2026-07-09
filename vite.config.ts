import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: "all",
    fs: { strict: false },
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: "all",
  },
});
