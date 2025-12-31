import { Material, MeshStandardMaterial, NearestFilter, SRGBColorSpace, Texture } from "three";
import { EntityTexture } from "./types";

export function createEntityMaterial(et: EntityTexture): Material[] {
	const materials: Material[] = [];
	const textures: Texture[] = [et.east, et.west, et.up, et.down, et.south, et.north];
	for (const texture of textures) {
		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;
		texture.colorSpace = SRGBColorSpace;
		materials.push(new MeshStandardMaterial({
			map: texture,
			color: 0xffffff,
			roughness: 1,
			metalness: 0
		}));
	}
	return materials;

}
