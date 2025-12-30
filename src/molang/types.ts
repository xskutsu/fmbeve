export enum MolangErrorType {
	SyntaxError = "SYNTAX_ERROR",
	UnknownFunction = "UNKNOWN_FUNCTION",
	UnknownVariable = "UNKNOWN_VARIABLE",
	InvallidParameters = "INVALID_PARAMETERS",
	UnexpectedEOF = "UNEXPECTED_EOF",
	MismatchedParentheses = "MISMATCHED_PARENTHESES"
}

export enum MolangTokenType {
	Number = "NUMBER",
	Identifier = "IDENTIFIER",
	OpenParen = "OPEN_PAREN",
	CloseParen = "CLOSE_PAREN",
	Comma = "COMMA",
	Plus = "PLUS",
	Minus = "MINUS",
	Multiply = "MULTIPLY",
	Divide = "DIVIDE",
	Modulo = "MODULO",
	Not = "NOT",
	Question = "QUESTION",
	Colon = "COLON",
	Equal = "EQUAL",
	NotEqual = "NOT_EQUAL",
	Greater = "GREATER",
	GreaterOrEqual = "GREATER_OR_EQUAL",
	Less = "LESS",
	LessOrEqual = "LESS_OR_EQUAL",
	And = "AND",
	Or = "OR",
	NullCoalesce = "NULL_COALESCE",
	EOF = "EOF",
	Unknown = "UNKNOWN"
}

export interface MolangExecSuccess {
	success: true;
	value: number;
}

export interface MolangExecFail {
	success: false;
	errorType: MolangErrorType;
	errorMessage: string;
	errorCharacterIndex: number;
}

export type MolangExec = MolangExecSuccess | MolangExecFail;
