#!/usr/bin/env node
/**
 * Smoke driver for packages/desktop
 * Usage: node smoke.mjs [--url http://localhost:5173] [--out /tmp/screenshots]
 *
 * Launches a headless Chromium, navigates the app, takes screenshots of all 4
 * views, and exits 0 on success or 1 on any failure.
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const CHROMIUM = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const url = process.argv.find((a) => a.startsWith("--url="))?.slice(6) ?? "http://localhost:5173";
const outDir = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? "/tmp/desktop-screenshots";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });

try {
  await page.goto(url, { waitUntil: "networkidle", timeout: 10_000 });

  // Editor view (default)
  await page.waitForSelector("h1", { timeout: 5_000 });
  const title = await page.textContent("h1");
  console.log(`Title: ${title}`);
  await page.screenshot({ path: resolve(outDir, "editor.png") });
  console.log(`✓ editor → ${outDir}/editor.png`);

  // Graph view
  await page.click("button:has-text('Graph')");
  await page.screenshot({ path: resolve(outDir, "graph.png") });
  console.log(`✓ graph → ${outDir}/graph.png`);

  // Timeline view
  await page.click("button:has-text('Timeline')");
  await page.screenshot({ path: resolve(outDir, "timeline.png") });
  console.log(`✓ timeline → ${outDir}/timeline.png`);

  // Insights view
  await page.click("button:has-text('Insights')");
  await page.waitForSelector("h2", { timeout: 3_000 });
  const insightsHeading = await page.textContent("h2");
  console.log(`Insights heading: ${insightsHeading}`);
  await page.screenshot({ path: resolve(outDir, "insights.png") });
  console.log(`✓ insights → ${outDir}/insights.png`);

  console.log("\n✅ All 4 views verified");
} finally {
  await browser.close();
}
