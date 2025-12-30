const isWhitespaceRegex = /\s/;

export function isWhitespace(character: string): boolean {
	return isWhitespaceRegex.test(character);
}

export function isDigit(character: string): boolean {
	const value: number = parseInt(character);
	return !isNaN(value);
}

const alphaCharacters = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"_"
];

export function isAlpha(character: string): boolean {
	return alphaCharacters.includes(character);
}

export function isIdentifierCharacter(character: string): boolean {
	return isAlpha(character) || isDigit(character) || character === ".";
}
