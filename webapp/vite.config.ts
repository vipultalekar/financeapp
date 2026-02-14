import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { vibecodePlugin } from "@vibecodeapp/webapp/plugin";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8000,
    allowedHosts: true, // Allow all hosts
  },
  plugins: [
    react(),
    mode === "development" && vibecodePlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-base": [
            "react",
            "react-dom",
            "react-router-dom",
            "framer-motion",
            "lucide-react",
            "clsx",
            "tailwind-merge",
            "@tanstack/react-query",
            "zod"
          ],
          "vendor-charts": ["recharts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
}));
