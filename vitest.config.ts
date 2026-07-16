import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Unit tests run in a Node environment (pure lib logic). The `@/…` alias
// mirrors tsconfig so tests import the same way app code does.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
    globals: true,
  },
});
