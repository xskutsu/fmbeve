export type MolangExecution = MolangExecutionSuccess | MolangExecutionFail;

export type MolangVariableMap = Map<string, () => number>;

export type MolangMathFunc = (...args: number[]) => number;

export enum MolangError {
	SyntaxError = "SYNTAX_ERROR",
	UnknownFunction = "UNKNOWN_FUNCTION",
	UnknownVariable = "UNKNOWN_VARIABLE",
	InvalidParameters = "INVALID_PARAMETERS",
	UnexpectedEOF = "UNEXPECTED_EOF",
	MismatchedParentheses = "MISMATCHED_PARENTHESES"
}

export enum MolangTokenType {
	Unknown,
	EOF,
	Number,
	Identifier,
	OpenParen,
	CloseParen,
	Comma,
	Plus,
	Minus,
	Multiply,
	Divide,
	Modulo,
	Not,
	Question,
	Colon,
	Equal,
	NotEqual,
	Greater,
	GreaterOrEqual,
	Less,
	LessOrEqual,
	And,
	Or,
	NullCoalesce
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
