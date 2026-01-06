import { DEG_TO_RAD, RAD_TO_DEG } from "../constants";
import type { MolangMathFunc } from "./types";

export const MathImpl: Record<string, MolangMathFunc> = {
	"math.abs": Math.abs,
	"math.acos": (x) => Math.acos(x) * RAD_TO_DEG,
	"math.asin": (x) => Math.asin(x) * RAD_TO_DEG,
	"math.atan": (x) => Math.atan(x) * RAD_TO_DEG,
	"math.atan2": (y, x) => Math.atan2(y, x) * RAD_TO_DEG,
	"math.ceil": Math.ceil,
	"math.clamp": (v, min, max) => Math.min(Math.max(v, min), max),
	"math.cos": (x) => Math.cos(x * DEG_TO_RAD),
	"math.cos01": (x) => (Math.cos(x * DEG_TO_RAD) + 1) / 2,
	"math.exp": Math.exp,
	"math.floor": Math.floor,
	"math.hermite_blend": (t) => 3 * t ** 2 - 2 * t ** 3,
	"math.lerp": (a, b, t) => a + (b - a) * t,
	"math.ln": Math.log,
	"math.max": Math.max,
	"math.min": Math.min,
	"math.mod": (v, d) => v % d,
	"math.pi": () => Math.PI,
	"math.pow": Math.pow,
	"math.random": (l, h) => Math.random() * (h - l) + l,
	"math.random_integer": (l, h) => Math.floor(Math.random() * (h - l + 1)) + l,
	"math.round": Math.round,
	"math.sin": (x) => Math.sin(x * DEG_TO_RAD),
	"math.sqrt": Math.sqrt,
	"math.tan": (x) => Math.tan(x * DEG_TO_RAD),
	"math.trunc": Math.trunc,
	"math.lerprotate": (a, b, t) => {
		const d: number = ((b - a + 180) % 360) - 180;
		return a + (d < -180 ? d + 360 : d) * t;
	}
};

export const MathArgCounts: Record<string, number> = {
	"math.abs": 1,
	"math.acos": 1,
	"math.asin": 1,
	"math.atan": 1,
	"math.atan2": 2,
	"math.ceil": 1,
	"math.clamp": 3,
	"math.cos": 1,
	"math.cos01": 1,
	"math.exp": 1,
	"math.floor": 1,
	"math.hermite_blend": 1,
	"math.lerp": 3,
	"math.ln": 1,
	"math.max": 2,
	"math.min": 2,
	"math.mod": 2,
	"math.pi": 0,
	"math.pow": 2,
	"math.random": 2,
	"math.random_integer": 2,
	"math.round": 1,
	"math.sin": 1,
	"math.sqrt": 1,
	"math.tan": 1,
	"math.trunc": 1,
	"math.lerprotate": 3
};
