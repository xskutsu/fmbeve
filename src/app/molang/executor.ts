import { MathArgCounts, MathImpl } from "./math";

const CHAR_0: number = 48;
const CHAR_9: number = 57;
const CHAR_A: number = 65;
const CHAR_Z: number = 90;
const CHAR_a: number = 97;
const CHAR_z: number = 122;
const CHAR_UNDERSCORE: number = 95;
const CHAR_DOT: number = 46;
const CHAR_LPAREN: number = 40;
const CHAR_RPAREN: number = 41;
const CHAR_COMMA: number = 44;
const CHAR_PLUS: number = 43;
const CHAR_MINUS: number = 45;
const CHAR_STAR: number = 42;
const CHAR_SLASH: number = 47;
const CHAR_PERCENT: number = 37;
const CHAR_EXCLAMATION: number = 33;
const CHAR_QUESTION: number = 63;
const CHAR_COLON: number = 58;
const CHAR_EQUALS: number = 61;
const CHAR_LT: number = 60;
const CHAR_GT: number = 62;
const CHAR_AMPERSAND: number = 38;
const CHAR_PIPE: number = 124;

import {
	MolangError,
	type MolangExecution,
	type MolangMathFunc,
	MolangTokenType,
	type MolangVariableMap
} from "./types";

class MolangParserError extends Error {
	constructor(
		public type: MolangError,
		public override message: string,
		public charIndex: number
	) {
		super(message);
	}
}

export function executeMolang(
	script: string,
	variables: MolangVariableMap | null = null
): MolangExecution {
	const length: number = script.length;
	let cursor: number = 0;
	let tokenType: MolangTokenType = MolangTokenType.Unknown;
	let tokenValue: number = 0;
	let tokenStr: string = "";
	let tokenStart: number = 0;
	const isWhitespace = (code: number) =>
		code === 32 || code === 9 || code === 10 || code === 13;
	const isDigit = (code: number) => code >= CHAR_0 && code <= CHAR_9;
	const isAlpha = (code: number) =>
		(code >= CHAR_A && code <= CHAR_Z) ||
		(code >= CHAR_a && code <= CHAR_z) ||
		code === CHAR_UNDERSCORE;
	const throwError = (type: MolangError, msg: string, pos: number = tokenStart): never => {
		throw new MolangParserError(type, msg, pos);
	};
	const nextToken = (): void => {
		while (cursor < length && isWhitespace(script.charCodeAt(cursor))) {
			cursor++;
		}
		if (cursor >= length) {
			tokenType = MolangTokenType.EOF;
			return;
		}
		tokenStart = cursor;
		const code: number = script.charCodeAt(cursor);
		if (
			isDigit(code) ||
			(code === CHAR_DOT &&
				cursor + 1 < length &&
				isDigit(script.charCodeAt(cursor + 1)))
		) {
			const start: number = cursor;
			let hasDot: boolean = code === CHAR_DOT;
			cursor++;
			while (cursor < length) {
				const c: number = script.charCodeAt(cursor);
				if (isDigit(c)) {
					cursor++;
				} else if (c === CHAR_DOT) {
					if (hasDot) {
						break;
					}

					hasDot = true;
					cursor++;
				} else if (c === 69 || c === 101) {
					cursor++;
					if (cursor < length) {
						const nextc: number = script.charCodeAt(cursor);
						if (nextc === CHAR_PLUS || nextc === CHAR_MINUS)
							cursor++;
					}
				} else {
					break;
				}
			}
			tokenType = MolangTokenType.Number;
			tokenValue = parseFloat(script.substring(start, cursor));
			return;
		}
		if (isAlpha(code)) {
			const start: number = cursor;
			cursor++;
			while (cursor < length) {
				const c: number = script.charCodeAt(cursor);
				if (isAlpha(c) || isDigit(c) || c === CHAR_DOT) {
					cursor++;
				} else {
					break;
				}
			}
			tokenType = MolangTokenType.Identifier;
			tokenStr = script.substring(start, cursor);
			return;
		}
		if (cursor + 1 < length) {
			const nextCode: number = script.charCodeAt(cursor + 1);
			let twoCharType: number = MolangTokenType.Unknown;
			if (code === CHAR_EQUALS && nextCode === CHAR_EQUALS) {
				twoCharType = MolangTokenType.Equal;
			} else if (code === CHAR_EXCLAMATION && nextCode === CHAR_EQUALS) {
				twoCharType = MolangTokenType.NotEqual;
			} else if (code === CHAR_GT && nextCode === CHAR_EQUALS) {
				twoCharType = MolangTokenType.GreaterOrEqual;
			} else if (code === CHAR_LT && nextCode === CHAR_EQUALS) {
				twoCharType = MolangTokenType.LessOrEqual;
			} else if (code === CHAR_AMPERSAND && nextCode === CHAR_AMPERSAND) {
				twoCharType = MolangTokenType.And;
			} else if (code === CHAR_PIPE && nextCode === CHAR_PIPE) {
				twoCharType = MolangTokenType.Or;
			} else if (code === CHAR_QUESTION && nextCode === CHAR_QUESTION) {
				twoCharType = MolangTokenType.NullCoalesce;
			}
			if (twoCharType !== MolangTokenType.Unknown) {
				tokenType = twoCharType;
				cursor += 2;
				return;
			}
		}
		cursor++;
		switch (code) {
			case CHAR_LPAREN:
				tokenType = MolangTokenType.OpenParen;
				break;
			case CHAR_RPAREN:
				tokenType = MolangTokenType.CloseParen;
				break;
			case CHAR_COMMA:
				tokenType = MolangTokenType.Comma;
				break;
			case CHAR_PLUS:
				tokenType = MolangTokenType.Plus;
				break;
			case CHAR_MINUS:
				tokenType = MolangTokenType.Minus;
				break;
			case CHAR_STAR:
				tokenType = MolangTokenType.Multiply;
				break;
			case CHAR_SLASH:
				tokenType = MolangTokenType.Divide;
				break;
			case CHAR_PERCENT:
				tokenType = MolangTokenType.Modulo;
				break;
			case CHAR_EXCLAMATION:
				tokenType = MolangTokenType.Not;
				break;
			case CHAR_QUESTION:
				tokenType = MolangTokenType.Question;
				break;
			case CHAR_COLON:
				tokenType = MolangTokenType.Colon;
				break;
			case CHAR_GT:
				tokenType = MolangTokenType.Greater;
				break;
			case CHAR_LT:
				tokenType = MolangTokenType.Less;
				break;
			default:
				throwError(
					MolangError.SyntaxError,
					`Unexpected character: '${String.fromCharCode(code)}'`
				);
		}
	};
	const parsePrimary = (): number => {
		if (tokenType === MolangTokenType.Number) {
			const val: number = tokenValue;
			nextToken();
			return val;
		}
		if (tokenType === MolangTokenType.OpenParen) {
			nextToken();
			const val: number = parseNullCoalesce();
			if ((tokenType as MolangTokenType) !== MolangTokenType.CloseParen) {
				throwError(MolangError.MismatchedParentheses, "Missing ')'");
			}
			nextToken();
			return val;
		}
		if (tokenType === MolangTokenType.Identifier) {
			const id: string = tokenStr;
			const idStart: number = tokenStart;
			nextToken();
			const mathFunc: MolangMathFunc | undefined = MathImpl[id];
			if (mathFunc !== undefined) {
				const requiredArgs: number | undefined = MathArgCounts[id];
				const args: number[] = [];
				if ((tokenType as MolangTokenType) === MolangTokenType.OpenParen) {
					nextToken();
					if (
						(tokenType as MolangTokenType) !==
						MolangTokenType.CloseParen
					) {
						args.push(parseNullCoalesce());
						while (
							(tokenType as MolangTokenType) ===
							MolangTokenType.Comma
						) {
							nextToken();
							args.push(parseNullCoalesce());
						}
					}
					if (
						(tokenType as MolangTokenType) !==
						MolangTokenType.CloseParen
					) {
						throwError(
							MolangError.MismatchedParentheses,
							"Expected ')' in function call"
						);
					}
					nextToken();
				}
				if (args.length !== requiredArgs) {
					throwError(
						MolangError.InvalidParameters,
						`${id} expects ${requiredArgs} args, got ${args.length}`,
						idStart
					);
				}
				return mathFunc(...args);
			} else {
				if (id.startsWith("math.")) {
					throwError(
						MolangError.UnknownFunction,
						`Unknown function: ${id}`,
						idStart
					);
				}
				const variableFunc: (() => number) | undefined = variables?.get(id);
				if (variableFunc === undefined) {
					return throwError(
						MolangError.UnknownVariable,
						`Variable not found: ${id}`,
						idStart
					);
				}
				return variableFunc();
			}
		}
		throwError(MolangError.SyntaxError, `Unexpected token`);
		return 0;
	};
	const parseUnary = (): number => {
		if (tokenType === MolangTokenType.Not) {
			nextToken();
			return parseUnary() === 0 ? 1 : 0;
		}
		if (tokenType === MolangTokenType.Minus) {
			nextToken();
			return -parseUnary();
		}
		return parsePrimary();
	};
	const parseMultiplication = (): number => {
		let left: number = parseUnary();
		while (
			(tokenType as MolangTokenType) === MolangTokenType.Multiply ||
			(tokenType as MolangTokenType) === MolangTokenType.Divide ||
			(tokenType as MolangTokenType) === MolangTokenType.Modulo
		) {
			const op: MolangTokenType = tokenType;
			nextToken();
			const right: number = parseUnary();
			if (op === MolangTokenType.Multiply) {
				left *= right;
			} else if (op === MolangTokenType.Divide) {
				left /= right;
			} else {
				left %= right;
			}
		}
		return left;
	};
	const parseAddition = (): number => {
		let left: number = parseMultiplication();
		while (
			(tokenType as MolangTokenType) === MolangTokenType.Plus ||
			(tokenType as MolangTokenType) === MolangTokenType.Minus
		) {
			const op: MolangTokenType = tokenType;
			nextToken();
			const right: number = parseMultiplication();
			if (op === MolangTokenType.Plus) {
				left += right;
			} else {
				left -= right;
			}
		}
		return left;
	};
	const parseComparison = (): number => {
		let left: number = parseAddition();
		while (
			(tokenType as MolangTokenType) === MolangTokenType.Less ||
			(tokenType as MolangTokenType) === MolangTokenType.LessOrEqual ||
			(tokenType as MolangTokenType) === MolangTokenType.Greater ||
			(tokenType as MolangTokenType) === MolangTokenType.GreaterOrEqual
		) {
			const op: MolangTokenType = tokenType;
			nextToken();
			const right: number = parseAddition();
			switch (op) {
				case MolangTokenType.Less:
					left = left < right ? 1 : 0;
					break;
				case MolangTokenType.LessOrEqual:
					left = left <= right ? 1 : 0;
					break;
				case MolangTokenType.Greater:
					left = left > right ? 1 : 0;
					break;
				case MolangTokenType.GreaterOrEqual:
					left = left >= right ? 1 : 0;
					break;
			}
		}
		return left;
	};
	const parseEquality = (): number => {
		let left: number = parseComparison();
		while (
			(tokenType as MolangTokenType) === MolangTokenType.Equal ||
			(tokenType as MolangTokenType) === MolangTokenType.NotEqual
		) {
			const op: MolangTokenType = tokenType;
			nextToken();
			const right: number = parseComparison();
			if (op === MolangTokenType.Equal) {
				left = left === right ? 1 : 0;
			} else {
				left = left !== right ? 1 : 0;
			}
		}
		return left;
	};
	const parseLogical = (): number => {
		let left: number = parseEquality();
		while (
			(tokenType as MolangTokenType) === MolangTokenType.And ||
			(tokenType as MolangTokenType) === MolangTokenType.Or
		) {
			const op: MolangTokenType = tokenType;
			nextToken();
			const right: number = parseEquality();
			if (op === MolangTokenType.And) {
				left = left !== 0 && right !== 0 ? 1 : 0;
			} else {
				left = left !== 0 || right !== 0 ? 1 : 0;
			}
		}
		return left;
	};
	const parseTernary = (): number => {
		const condition: number = parseLogical();
		if ((tokenType as MolangTokenType) === MolangTokenType.Question) {
			nextToken();
			const trueVal: number = parseTernary();
			if ((tokenType as MolangTokenType) !== MolangTokenType.Colon) {
				throwError(MolangError.SyntaxError, "Ternary missing ':'");
			}
			nextToken();
			const falseVal: number = parseTernary();
			return condition !== 0 ? trueVal : falseVal;
		}
		return condition;
	};
	const parseNullCoalesce = (): number => {
		let left: number = parseTernary();
		while ((tokenType as MolangTokenType) === MolangTokenType.NullCoalesce) {
			nextToken();
			const right: number = parseTernary();
			if (Number.isNaN(left)) {
				left = right;
			}
		}
		return left;
	};
	try {
		if (script.trim().length === 0) {
			return {
				success: false,
				error: MolangError.UnexpectedEOF,
				errorMessage: "Empty script",
				errorCharacterIndex: 0
			};
		}
		nextToken();
		if ((tokenType as MolangTokenType) === MolangTokenType.EOF) {
			return {
				success: false,
				error: MolangError.UnexpectedEOF,
				errorMessage: "Unexpected EOF",
				errorCharacterIndex: 0
			};
		}
		const result: number = parseNullCoalesce();
		if ((tokenType as MolangTokenType) !== MolangTokenType.EOF) {
			return {
				success: false,
				error: MolangError.SyntaxError,
				errorMessage: "Unexpected token at end of script",
				errorCharacterIndex: tokenStart
			};
		}
		return {
			success: true,
			value: result
		};
	} catch (e) {
		if (e instanceof MolangParserError) {
			return {
				success: false,
				error: e.type,
				errorMessage: e.message,
				errorCharacterIndex: e.charIndex
			};
		}
		return {
			success: false,
			error: MolangError.SyntaxError,
			errorMessage: (e as Error).message || "Unknown error",
			errorCharacterIndex: cursor
		};
	}
}
