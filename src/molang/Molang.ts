import { isAlpha, isDigit, isIdentifierCharacter, isWhitespace } from "./lexer";
import { MathRegistry, TokenMap } from "./registry";
import { MolangErrorType, MolangExec, MolangExecFail, MolangExecSuccess, MolangTokenType } from "./types";

export default class Molang {
	private static _script: string = "";
	private static _length: number = 0;
	private static _cursor: number = 0;
	private static _currentTokenValue: string = "";
	private static _currentTokenType: MolangTokenType = MolangTokenType.Unknown;
	private static _tokenPosition: number = 0;
	private static _variables: Map<string, () => number> | null = null;

	public static execute(script: string, variables: Map<string, () => number> | null = null): MolangExec {
		script = script.trim();
		this._script = script;
		this._length = script.length;
		this._variables = variables;
		this._cursor = 0;
		this._tokenPosition = 0;
		this._currentTokenValue = "";
		if (this._length === 0) {
			return this.createError(MolangErrorType.UnexpectedEOF, "Empty script");
		}
		const initialTokenError: MolangExecFail | null = this.nextToken();
		if (initialTokenError) {
			return this.cleanup(initialTokenError);
		}
		const result: number | MolangExecFail = this.parseNullCoalesce();
		if (this._isError(result)) {
			return this.cleanup(result);
		}
		if (this._getTokenType() !== MolangTokenType.EOF) {
			return this.cleanup(this.createError(MolangErrorType.SyntaxError, "Unexpected token at end of script"));
		}
		const successResult: MolangExecSuccess = {
			success: true,
			value: result
		};
		this.cleanup(null);
		return successResult;
	}

	private static _getTokenType(): MolangTokenType {
		return this._currentTokenType;
	}

	private static _isError(result: number | MolangExecFail): result is MolangExecFail {
		return typeof result !== "number";
	}

	private static cleanup(result: MolangExecFail | null): MolangExecFail {
		this._script = "";
		this._length = 0;
		this._cursor = 0;
		this._currentTokenValue = "";
		this._currentTokenType = MolangTokenType.Unknown;
		this._tokenPosition = 0;
		this._variables = null;
		if (result) {
			return result;
		}
		return {
			success: false,
			errorType: MolangErrorType.SyntaxError,
			errorMessage: "Unknown Error",
			errorCharacterIndex: 0
		};
	}

	private static createError(type: MolangErrorType, errorMessage: string, position?: number): MolangExecFail {
		return {
			success: false,
			errorType: type,
			errorMessage: errorMessage,
			errorCharacterIndex: position !== undefined ? position : this._tokenPosition
		};
	}

	private static nextToken(): MolangExecFail | null {
		while (this._cursor < this._length && isWhitespace(this._script[this._cursor])) {
			this._cursor++;
		}
		if (this._cursor >= this._length) {
			this._tokenPosition = this._length;
			this._currentTokenValue = "EOF";
			this._currentTokenType = MolangTokenType.EOF;
			return null;
		}
		this._tokenPosition = this._cursor;
		const character: string = this._script[this._cursor];
		if (isDigit(character) || (character === "." && this._cursor + 1 < this._length && isDigit(this._script[this._cursor + 1]))) {
			this._readNumber();
			return null;
		}
		if (this._cursor + 1 < this._length) {
			const twoCharacterString: string = this._script.substring(this._cursor, this._cursor + 2);
			const complexToken: MolangTokenType | undefined = TokenMap.get(twoCharacterString);
			if (complexToken !== undefined) {
				this._currentTokenValue = twoCharacterString;
				this._currentTokenType = complexToken;
				this._cursor += 2;
				return null;
			}
		}
		const simpleToken: MolangTokenType | undefined = TokenMap.get(character);
		if (simpleToken !== undefined) {
			this._currentTokenValue = character;
			this._currentTokenType = simpleToken;
			this._cursor++;
			return null;
		}
		if (isAlpha(character)) {
			this._readIdentifier();
			return null;
		}
		return this.createError(MolangErrorType.SyntaxError, `Unexpected character: '${character}'`, this._cursor);
	}

	private static _readNumber(): void {
		let endPosition: number = this._cursor + 1;
		let hasDot: boolean = this._script[this._cursor] === ".";
		let hasExponent: boolean = false;
		while (endPosition < this._length) {
			const innerCharacter: string = this._script[endPosition];
			if (isDigit(innerCharacter)) {
				endPosition++;
			} else if (innerCharacter === "." && !hasDot && !hasExponent) {
				hasDot = true;
				endPosition++;
			} else if ((innerCharacter === "e" || innerCharacter === "E") && !hasExponent) {
				hasExponent = true;
				endPosition++;
				if (endPosition < this._length && (this._script[endPosition] === "+" || this._script[endPosition] === "-")) {
					endPosition++;
				}
			} else {
				break;
			}
		}
		this._currentTokenValue = this._script.substring(this._cursor, endPosition);
		this._currentTokenType = MolangTokenType.Number;
		this._cursor = endPosition;
	}

	private static _readIdentifier(): void {
		let endPosition: number = this._cursor + 1;
		while (endPosition < this._length && isIdentifierCharacter(this._script[endPosition])) {
			endPosition++;
		}
		this._currentTokenValue = this._script.substring(this._cursor, endPosition);
		this._currentTokenType = MolangTokenType.Identifier;
		this._cursor = endPosition;
	}

	private static _parseBinary(
		nextParser: () => number | MolangExecFail,
		shouldContinue: (tokenType: MolangTokenType) => boolean,
		applyOperation: (left: number, right: number, tokenType: MolangTokenType) => number
	): number | MolangExecFail {
		let leftValue: number | MolangExecFail = nextParser.call(this);
		if (this._isError(leftValue)) {
			return leftValue;
		}
		while (shouldContinue(this._currentTokenType)) {
			const operatorType: MolangTokenType = this._currentTokenType;
			const operatorError: MolangExecFail | null = this.nextToken();
			if (operatorError) {
				return operatorError;
			}
			const rightValue: number | MolangExecFail = nextParser.call(this);
			if (this._isError(rightValue)) {
				return rightValue;
			}
			leftValue = applyOperation(leftValue, rightValue, operatorType);
		}
		return leftValue;
	}

	private static parsePrimary(): number | MolangExecFail {
		const currentPosition: number = this._tokenPosition;
		if (this._currentTokenType === MolangTokenType.Number) {
			const value: number = parseFloat(this._currentTokenValue);
			const tokenError: MolangExecFail | null = this.nextToken();
			if (tokenError) {
				return tokenError;
			}
			return value;
		}
		if (this._currentTokenType === MolangTokenType.OpenParen) {
			const openParenError: MolangExecFail | null = this.nextToken();
			if (openParenError) {
				return openParenError;
			}
			const result: number | MolangExecFail = this.parseNullCoalesce();
			if (this._isError(result)) {
				return result;
			}
			if (this._getTokenType() !== MolangTokenType.CloseParen) {
				return this.createError(MolangErrorType.MismatchedParentheses, "Missing ')'", currentPosition);
			}
			const closeParenError: MolangExecFail | null = this.nextToken();
			if (closeParenError) {
				return closeParenError;
			}
			return result;
		}
		if (this._currentTokenType === MolangTokenType.Identifier) {
			const identifier: string = this._currentTokenValue;
			if (identifier in MathRegistry) {
				const functionEntry: [number, (...args: number[]) => number] = MathRegistry[identifier];
				return this._parseFunctionCall(identifier, functionEntry[0], functionEntry[1]);
			} else if (identifier.startsWith("math.")) {
				return this.createError(MolangErrorType.UnknownFunction, `Unknown function: ${identifier}`, currentPosition);
			} else {
				if (this._variables === null || !this._variables.has(identifier)) {
					return this.createError(MolangErrorType.UnknownVariable, `Variable not found: ${identifier}`, currentPosition);
				}
				const variableProvider: (() => number) | undefined = this._variables.get(identifier);
				if (variableProvider === undefined) {
					return this.createError(MolangErrorType.UnknownVariable, `Variable not found: ${identifier}`, currentPosition);
				}
				const variableTokenError: MolangExecFail | null = this.nextToken();
				if (variableTokenError) {
					return variableTokenError;
				}
				return variableProvider();
			}
		}
		return this.createError(MolangErrorType.SyntaxError, `Unexpected token: ${this._currentTokenValue}`, currentPosition);
	}

	private static _parseFunctionCall(identifier: string, argumentCount: number, implementation: (...args: number[]) => number): number | MolangExecFail {
		const currentPosition: number = this._tokenPosition;
		const functionTokenError: MolangExecFail | null = this.nextToken();
		if (functionTokenError) {
			return functionTokenError;
		}
		const argumentsList: number[] = [];
		if (this._getTokenType() === MolangTokenType.OpenParen) {
			const argsOpenParenError: MolangExecFail | null = this.nextToken();
			if (argsOpenParenError) {
				return argsOpenParenError;
			}
			if (this._getTokenType() !== MolangTokenType.CloseParen) {
				const firstArg: number | MolangExecFail = this.parseNullCoalesce();
				if (this._isError(firstArg)) {
					return firstArg;
				}
				argumentsList.push(firstArg);
				while (this._getTokenType() === MolangTokenType.Comma) {
					const commaError: MolangExecFail | null = this.nextToken();
					if (commaError) {
						return commaError;
					}
					const nextArg: number | MolangExecFail = this.parseNullCoalesce();
					if (this._isError(nextArg)) {
						return nextArg;
					}
					argumentsList.push(nextArg);
				}
			}
			if (this._getTokenType() !== MolangTokenType.CloseParen) {
				return this.createError(MolangErrorType.MismatchedParentheses, "Expected ')'", currentPosition);
			}
			const argsCloseParenError: MolangExecFail | null = this.nextToken();
			if (argsCloseParenError) {
				return argsCloseParenError;
			}
		}
		if (argumentsList.length !== argumentCount) {
			return this.createError(MolangErrorType.InvallidParameters, `${identifier} expects ${argumentCount} args, got ${argumentsList.length}`, currentPosition);
		}
		return implementation(...argumentsList);
	}

	private static parseUnary(): number | MolangExecFail {
		if (this._currentTokenType === MolangTokenType.Not) {
			const notTokenError: MolangExecFail | null = this.nextToken();
			if (notTokenError) {
				return notTokenError;
			}
			const value: number | MolangExecFail = this.parseUnary();
			if (this._isError(value)) {
				return value;
			}
			return value === 0 ? 1 : 0;
		}
		if (this._currentTokenType === MolangTokenType.Minus) {
			const minusTokenError: MolangExecFail | null = this.nextToken();
			if (minusTokenError) {
				return minusTokenError;
			}
			const value: number | MolangExecFail = this.parseUnary();
			if (this._isError(value)) {
				return value;
			}
			return -value;
		}
		return this.parsePrimary();
	}

	private static parseMultiplication(): number | MolangExecFail {
		return this._parseBinary(
			this.parseUnary,
			t => t === MolangTokenType.Multiply || t === MolangTokenType.Divide || t === MolangTokenType.Modulo,
			(left, right, op) => {
				if (op === MolangTokenType.Multiply) return left * right;
				if (op === MolangTokenType.Divide) return left / right;
				return left % right;
			}
		);
	}

	private static parseAddition(): number | MolangExecFail {
		return this._parseBinary(
			this.parseMultiplication,
			t => t === MolangTokenType.Plus || t === MolangTokenType.Minus,
			(left, right, op) => op === MolangTokenType.Plus ? left + right : left - right
		);
	}

	private static parseComparison(): number | MolangExecFail {
		return this._parseBinary(
			this.parseAddition,
			t => t === MolangTokenType.Less || t === MolangTokenType.LessOrEqual || t === MolangTokenType.Greater || t === MolangTokenType.GreaterOrEqual,
			(left, right, op) => {
				switch (op) {
					case MolangTokenType.Less: return left < right ? 1 : 0;
					case MolangTokenType.LessOrEqual: return left <= right ? 1 : 0;
					case MolangTokenType.Greater: return left > right ? 1 : 0;
					case MolangTokenType.GreaterOrEqual: return left >= right ? 1 : 0;
				}
				return 0;
			}
		);
	}

	private static parseEquality(): number | MolangExecFail {
		return this._parseBinary(
			this.parseComparison,
			t => t === MolangTokenType.Equal || t === MolangTokenType.NotEqual,
			(left, right, op) => op === MolangTokenType.Equal ? (left === right ? 1 : 0) : (left !== right ? 1 : 0)
		);
	}

	private static parseLogical(): number | MolangExecFail {
		return this._parseBinary(
			this.parseEquality,
			t => t === MolangTokenType.And || t === MolangTokenType.Or,
			(left, right, op) => op === MolangTokenType.And ? (left !== 0 && right !== 0 ? 1 : 0) : (left !== 0 || right !== 0 ? 1 : 0)
		);
	}

	private static parseTernary(): number | MolangExecFail {
		const conditionValue: number | MolangExecFail = this.parseLogical();
		if (this._isError(conditionValue)) {
			return conditionValue;
		}
		if (this._currentTokenType === MolangTokenType.Question) {
			const questionTokenError: MolangExecFail | null = this.nextToken();
			if (questionTokenError) {
				return questionTokenError;
			}
			const leftValue: number | MolangExecFail = this.parseTernary();
			if (this._isError(leftValue)) {
				return leftValue;
			}
			if (this._getTokenType() !== MolangTokenType.Colon) {
				return this.createError(MolangErrorType.SyntaxError, "Ternary missing ':'");
			}
			const colonTokenError: MolangExecFail | null = this.nextToken();
			if (colonTokenError) {
				return colonTokenError;
			}
			const rightValue: number | MolangExecFail = this.parseTernary();
			if (this._isError(rightValue)) {
				return rightValue;
			}
			return conditionValue !== 0 ? leftValue : rightValue;
		}
		return conditionValue;
	}

	private static parseNullCoalesce(): number | MolangExecFail {
		return this._parseBinary(
			this.parseTernary,
			t => t === MolangTokenType.NullCoalesce,
			(left, right) => (left !== null && !isNaN(left)) ? left : right
		);
	}
}
