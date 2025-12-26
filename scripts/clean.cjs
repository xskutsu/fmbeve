const fs = require("fs");
const path = require("path");
const projectRoot = path.resolve(__dirname, "..");
const pathsToDelete = [
	"public/js/bundle.js",
	"public/js/bundle.js.map"
];
console.log("Starting cleaning...");
for (let p of pathsToDelete) {
	p = path.join(projectRoot, p);
	try {
		fs.rmSync(p, {
			recursive: true
		});
	} catch (error) {
		if (error.code === "ENOENT") {
			console.error("Skipping missing path:", p);
		} else {
			console.error("Failed to delete path:", p, error);
		}
	}
}
console.log("Cleaning complete.");
