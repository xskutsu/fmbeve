import { executeMolang } from "../molang/executor";
import type { MolangExecution } from "../molang/types";
import type { FMBEValue } from "./types";

export function parseFMBEValue(value: FMBEValue, defaultValue: number): number {
	if (value === null) {
		return defaultValue;
	}
	if (typeof value === "string") {
		const result: MolangExecution = executeMolang(
			value,
			new Map([["q.life_time", () => performance.now() / 1000]])
		);
		if (result.success) {
			return result.value;
		} else {
			console.error(result);
			return defaultValue;
		}
	}
	return value;
}
