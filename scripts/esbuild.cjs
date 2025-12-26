const esbuild = require("esbuild");
const { spawn } = require("node:child_process");
const isWatch = process.argv.includes("--watch");
const isRun = process.argv.includes("--run");
const banner = `
// 2025 (C) All Rights Reserved.
// https://github.com/xskutsu/fmbe-visual-editor
`.trim();

async function build(config) {
	return await esbuild.context({
		bundle: true,
		target: "es2024",
		sourcemap: true,
		banner: {
			js: banner
		},
		...config
	});
}

(async function () {
	console.log("Starting building...");
	const context = await build({
		entryPoints: ["./src/index.ts"],
		sourcesContent: false,
		format: "iife",
		outfile: "public/js/bundle.js",
		platform: "browser",
		minify: true,
		tsconfig: "./tsconfig.json"
	});
	console.log("Esbuild contexts established.");
	if (isWatch) {
		console.log("Starting watch...");
		await context.watch();
		console.log("Wathcing for changes in client and server.");
	} else {
		await context.rebuild();
		await context.dispose();
		console.log("Build complete.");
	}
})();
