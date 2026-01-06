import {
	BoxGeometry,
	type Material,
	Mesh,
	MeshBasicMaterial,
	NearestFilter,
	SRGBColorSpace,
	type Texture
} from "three";
import { applyMinecraftShader } from "../viewport/applyMinecraftShading";
import type { EntityTexture } from "./types";

export function createBlockMesh(et: EntityTexture): Mesh {
	const materials: Material[] = [];
	const textures: Texture[] = [et.east, et.west, et.up, et.down, et.south, et.north];
	for (const texture of textures) {
		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;
		texture.colorSpace = SRGBColorSpace;
		const material = new MeshBasicMaterial({
			map: texture,
			transparent: true
		});
		applyMinecraftShader(material);
		materials.push(material);
	}
	return new Mesh(new BoxGeometry(1, 1, 1), materials);
}
