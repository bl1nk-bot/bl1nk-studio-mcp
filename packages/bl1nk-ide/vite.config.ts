import { URL, fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
	},
	clearScreen: false,
	server: {
		port: 5000,
		strictPort: false,
		host: host || "0.0.0.0",
		allowedHosts: true,
		hmr: host ? { protocol: "ws", host, port: 5001 } : undefined,
		watch: { ignored: ["**/src-tauri/**"] },
	},
});
