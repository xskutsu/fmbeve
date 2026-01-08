export type FMBEValue = number | string | null;

export enum FMBEType {
	block3D,
	block2D,
	item
}

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

export interface FMBEData {
	scale: FMBEValue;
	position: FMBEVector3;
	basePosition: FMBEVector3;
	rotation: FMBEVector3;
	extend: FMBEExtend;
}

export interface FMBE {
	data: FMBEData;
	type: FMBEType;
}
