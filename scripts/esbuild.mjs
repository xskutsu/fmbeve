import * as esbuild from "esbuild";

const isWatch = process.argv.includes("--watch");
const banner = `
// 2026 (C) AGPL-3.0-or-later
// https://github.com/xskutsu/fmbeve
`.trim();

(async () => {
	console.log("Starting building...");
	const context = await esbuild.context({
		banner: {
			js: banner
		},
		bundle: true,
		entryPoints: ["./src/app/index.ts", "./src/sw/index.ts"],
		format: "iife",
		minify: true,
		outdir: "dist/",
		platform: "browser",
		sourcemap: false,
		sourcesContent: false,
		target: "es2020",
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
