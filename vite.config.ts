import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/ocean-temp-game/",
  server: {
    port: 8080,
    open: true,
  },
});
