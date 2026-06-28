import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: [
			"packages/core/src/**/*.test.ts",
			"packages/sync/src/**/*.test.ts",
			"tests/**/*.test.ts",
		],
		exclude: ["node_modules", "dist"],
	},
});
