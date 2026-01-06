import { rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, "..");
const pathsToDelete = ["public/js/", "dist/"];
console.log("Starting cleaning...");

for (let p of pathsToDelete) {
	p = join(projectRoot, p);
	try {
		rmSync(p, {
			recursive: true,
		});
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "ENOENT"
		) {
			console.error("Skipping missing path:", p);
		} else {
			console.error("Failed to delete path:", p, error);
		}
	}
}

console.log("Cleaning complete.");
