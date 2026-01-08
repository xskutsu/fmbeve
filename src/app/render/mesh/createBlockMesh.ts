import {
	BoxGeometry,
	type Material,
	Mesh,
	MeshBasicMaterial,
	NearestFilter,
	SRGBColorSpace
} from "three";
import { applyFaceShader } from "../shader/faceShader";
import type { BlockTexture } from "./types";

export function createBlockMesh(blockTexture: BlockTexture): Mesh {
	const materials: Material[] = [];
	for (const texture of [
		blockTexture.east,
		blockTexture.west,
		blockTexture.up,
		blockTexture.down,
		blockTexture.south,
		blockTexture.north
	]) {
		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;
		texture.colorSpace = SRGBColorSpace;
		const material: MeshBasicMaterial = new MeshBasicMaterial({
			map: texture,
			transparent: true
		});
		applyFaceShader(material);
		materials.push(material);
	}
	return new Mesh(new BoxGeometry(1, 1, 1), materials);
}
