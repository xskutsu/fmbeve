export enum MolangError {
	SyntaxError = "SYNTAX_ERROR",
	UnknownFunction = "UNKNOWN_FUNCTION",
	UnknownVariable = "UNKNOWN_VARIABLE",
	InvalidParameters = "INVALID_PARAMETERS",
	UnexpectedEOF = "UNEXPECTED_EOF",
	MismatchedParentheses = "MISMATCHED_PARENTHESES"
}

export interface MolangExecutionSuccess {
	success: true;
	value: number;
}

export interface MolangExecutionFail {
	success: false;
	error: MolangError;
	errorMessage: string;
	errorCharacterIndex: number;
}

export type MolangExecution = MolangExecutionSuccess | MolangExecutionFail;

export type MolangVariableMap = Map<string, () => number>;

export type MolangMathFunc = (...args: number[]) => number;

export enum MolangTokenType {
	Unknown = 0,
	EOF = 1,
	Number = 2,
	Identifier = 3,
	OpenParen = 4,
	CloseParen = 5,
	Comma = 6,
	Plus = 7,
	Minus = 8,
	Multiply = 9,
	Divide = 10,
	Modulo = 11,
	Not = 12,
	Question = 13,
	Colon = 14,
	Equal = 15,
	NotEqual = 16,
	Greater = 17,
	GreaterOrEqual = 18,
	Less = 19,
	LessOrEqual = 20,
	And = 21,
	Or = 22,
	NullCoalesce = 23
}
