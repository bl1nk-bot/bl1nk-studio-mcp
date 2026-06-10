#!/usr/bin/env node

/**
 * Build script with proper reporting and status updates
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function log(level, message, data = null) {
	const timestamp = new Date().toISOString();
	const prefix = `[${timestamp}] ${level.toUpperCase()}:`;
	console.log(`${prefix} ${message}`);
	if (data) {
		console.log(`  └─ ${JSON.stringify(data, null, 2)}`);
	}
}

function logStatus(message, data = null) {
	log("status", message, data);
}

function logWarning(message, data = null) {
	log("warn", message, data);
}

function logError(message, error = null) {
	log("error", message, error);
}

function loadConfig() {
	try {
		const configPath = join(__dirname, "bl1nk-config.json");
		if (!existsSync(configPath)) {
			logWarning("Config file not found, using defaults", { path: configPath });
			return {};
		}
		const config = JSON.parse(readFileSync(configPath, "utf8"));
		logStatus("Config loaded successfully", {
			version: config.templateConfig?.version,
		});
		return config;
	} catch (error) {
		logError("Failed to load config", error);
		return {};
	}
}

async function runBuild() {
	const config = loadConfig();
	const buildConfig = config.buildConfig || {};

	logStatus("Starting build process...");

	try {
		// Change to the correct directory
		const packageDir = join(__dirname, "..", "packages", "bl1nk-core");
		process.chdir(packageDir);
		logStatus("Changed to package directory", { dir: packageDir });

		// Check if esbuild is available
		logStatus("Checking build dependencies...");
		const esbuild = await import("esbuild");

		// Run build
		logStatus("Building MCP server...", {
			entryPoint: buildConfig.entryPoint || "src/index.ts",
			output: buildConfig.output || "dist/index.js",
		});

		await esbuild.build({
			entryPoints: [buildConfig.entryPoint || "src/index.ts"],
			bundle: buildConfig.bundle !== false,
			platform: buildConfig.platform || "node",
			format: buildConfig.format || "esm",
			outfile: buildConfig.output || "dist/index.js",
			packages: buildConfig.packages || "bundle",
		});

		logStatus("✅ Build completed successfully!");
	} catch (error) {
		logError("❌ Build failed", error);
		process.exit(1);
	}
}

async function runQualityChecks() {
	const config = loadConfig();
	const qualityConfig = config.qualityConfig || {};

	logStatus("Running quality checks...");

	try {
		// Check biome
		if (qualityConfig.linter === "biome") {
			logStatus("Running Biome linter...");
			try {
				execSync("npx biome check --apply-unsafe .", { stdio: "inherit" });
				logStatus("✅ Biome linting passed");
			} catch (error) {
				logWarning("⚠️  Biome linting had issues (may be expected)", {
					exitCode: error.status,
					message: "Biome may not be installed or configured",
				});
			}
		}

		// Run tests
		if (qualityConfig.testRunner === "vitest") {
			logStatus("Running tests...");
			try {
				execSync("npm test", { stdio: "inherit" });
				logStatus("✅ Tests passed");
			} catch (error) {
				logError("❌ Tests failed", error);
				process.exit(1);
			}
		}
	} catch (error) {
		logError("Quality checks failed", error);
		process.exit(1);
	}
}

// Main execution
async function main() {
	const args = process.argv.slice(2);
	const command = args[0] || "build";

	logStatus(`Starting ${command} process for bl1nk-visual-mcp`);

	switch (command) {
		case "build":
			await runBuild();
			break;
		case "check":
			await runQualityChecks();
			break;
		case "all":
			await runBuild();
			await runQualityChecks();
			logStatus("🎉 All processes completed successfully!");
			break;
		default:
			logError(`Unknown command: ${command}`);
			logStatus("Available commands: build, check, all");
			process.exit(1);
	}
}

main().catch((error) => {
	logError("Unexpected error", error);
	process.exit(1);
});
