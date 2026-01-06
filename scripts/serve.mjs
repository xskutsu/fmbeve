import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT ?? "3001";

const app = express();
app.use(express.static(join(__dirname, "../public")));

app.get("/js/app/index.js", (_req, res) => {
	res.sendFile(join(__dirname, "../dist/app/index.js"));
});
app.get("/js/sw/index.js", (_req, res) => {
	res.sendFile(join(__dirname, "../dist/sw/index.js"));
});

app.listen(port, () => {
	console.log("Serving on port:", port);
	console.log(`http://localhost:${port}`);
});
