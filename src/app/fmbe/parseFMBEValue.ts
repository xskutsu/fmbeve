import { executeMolang } from "../molang/executor";
import type { MolangVariableMap } from "../molang/types";
import type { FMBEValue } from "./types";

export function parseFMBEValue(
	value: FMBEValue,
	defaultValue: number,
	variables: MolangVariableMap | null
): number {
	if (value === null) {
		return defaultValue;
	}
	if (typeof value === "string") {
		const result = executeMolang(value, variables);
		if (result.success) {
			return result.value;
		} else {
			console.error(result);
			return defaultValue;
		}
	}
	return value;
}
