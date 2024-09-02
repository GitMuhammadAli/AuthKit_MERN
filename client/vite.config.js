import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Changing port Should also Change in Third-Party-logins
    port: 4000,
    watch: {
      usePolling: true,
    },
  },
});
