import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // preview: {
  // port: 5173,
  // strictPort: true,
  // },
  server: {
    host: "0.0.0.0",
    port: 5173,
    // strictPort: true,
    // origin: "http://0.0.0.0:5173",
    watch: {
      usePolling: true,
    },
  },
});
