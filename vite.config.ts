import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        "pgbouncer-alternative/index": path.resolve(__dirname, "pgbouncer-alternative/index.html"),
        "postgresql-connection-pooling/index": path.resolve(__dirname, "postgresql-connection-pooling/index.html"),
        "postgresql-backpressure/index": path.resolve(__dirname, "postgresql-backpressure/index.html"),
      },
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
