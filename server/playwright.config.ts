import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./client/e2e",
  use: {
    baseURL: "http://localhost:5173",
  },
});
