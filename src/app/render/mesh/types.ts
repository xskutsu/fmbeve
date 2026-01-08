import type { Texture } from "three";

export interface BlockTexture {
	up: Texture;
	down: Texture;
	north: Texture;
	south: Texture;
	east: Texture;
	west: Texture;
}
