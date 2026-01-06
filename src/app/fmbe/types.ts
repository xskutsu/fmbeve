export type FMBEValue = number | string | null;

export interface FMBEVector3 {
	x: FMBEValue;
	y: FMBEValue;
	z: FMBEValue;
}

export interface FMBEVector2 {
	x: FMBEValue;
	y: FMBEValue;
}

export interface FMBEExtend {
	scale: FMBEValue;
	rotation: FMBEVector2;
}

export interface FMBE {
	position: FMBEVector3;
	basePosition: FMBEVector3;
	rotation: FMBEVector3;
	scale: FMBEValue;
	extend: FMBEExtend;
}
