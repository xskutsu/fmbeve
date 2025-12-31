import Molang from "../molang/Molang";
import { MolangExec } from "../molang/types";
import { FMBEValue } from "./types";

export function parseFMBEValue(value: FMBEValue, defaultValue: number): number {
	if (value === null) {
		return defaultValue;
	}
	if (typeof value === "string") {
		const result: MolangExec = Molang.execute(value, new Map([
			["q.life_time", () => performance.now() / 1000]
		]));
		if (result.success) {
			return result.value;
		} else {
			console.error(result);
			return defaultValue;
		}

	}
	return value;
}
