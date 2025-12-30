import { DEG_TO_RAD, RAD_TO_DEG } from "../constants";
import { MolangTokenType } from "./types";

export const MathRegistry: Record<string, [number, (...args: number[]) => number]> = {
	"math.abs": [1, Math.abs],
	"math.acos": [1, x => Math.acos(x) * RAD_TO_DEG],
	"math.asin": [1, x => Math.asin(x) * RAD_TO_DEG],
	"math.atan": [1, x => Math.atan(x) * RAD_TO_DEG],
	"math.atan2": [2, (y, x) => Math.atan2(y, x) * RAD_TO_DEG],
	"math.ceil": [1, Math.ceil],
	"math.clamp": [3, (v, min, max) => Math.min(Math.max(v, min), max)],
	"math.cos": [1, x => Math.cos(x * DEG_TO_RAD)],
	"math.cos01": [1, x => (Math.cos(x * DEG_TO_RAD) + 1) / 2],
	"math.exp": [1, Math.exp],
	"math.floor": [1, Math.floor],
	"math.hermite_blend": [1, t => 3 * (t ** 2) - 2 * (t ** 3)],
	"math.lerp": [3, (a, b, t) => a + (b - a) * t],
	"math.lerprotate": [3, (a, b, t) => {
		let d = (b - a + 180) % 360 - 180;
		return a + (d < -180 ? d + 360 : d) * t;
	}],
	"math.ln": [1, Math.log],
	"math.max": [2, Math.max],
	"math.min": [2, Math.min],
	"math.mod": [2, (v, d) => v % d],
	"math.pow": [2, Math.pow],
	"math.random": [2, (l, h) => Math.random() * (h - l) + l],
	"math.random_integer": [2, (l, h) => Math.floor(Math.random() * (h - l + 1)) + l],
	"math.round": [1, Math.round],
	"math.sin": [1, x => Math.sin(x * DEG_TO_RAD)],
	"math.sqrt": [1, Math.sqrt],
	"math.tan": [1, x => Math.tan(x * DEG_TO_RAD)],
	"math.trunc": [1, Math.trunc],
	"math.pi": [0, () => Math.PI]
};

export const TokenMap: Map<string, MolangTokenType> = new Map<string, MolangTokenType>([
	["(", MolangTokenType.OpenParen],
	[")", MolangTokenType.CloseParen],
	[",", MolangTokenType.Comma],
	["+", MolangTokenType.Plus],
	["-", MolangTokenType.Minus],
	["*", MolangTokenType.Multiply],
	["/", MolangTokenType.Divide],
	["%", MolangTokenType.Modulo],
	["!", MolangTokenType.Not],
	["?", MolangTokenType.Question],
	[":", MolangTokenType.Colon],
	["==", MolangTokenType.Equal],
	["!=", MolangTokenType.NotEqual],
	[">", MolangTokenType.Greater],
	[">=", MolangTokenType.GreaterOrEqual],
	["<", MolangTokenType.Less],
	["<=", MolangTokenType.LessOrEqual],
	["&&", MolangTokenType.And],
	["||", MolangTokenType.Or],
	["??", MolangTokenType.NullCoalesce]
]);
