import { BoxGeometry, Color, Mesh, MeshStandardMaterial, Texture } from "three";
import { scene } from "../viewport/Viewport";

interface EntityTexture {
	up: Texture;
	down: Texture;
	north: Texture;
	south: Texture;
	east: Texture;
	west: Texture;
}

const geometry = new BoxGeometry(1, 1, 1);

const material = new MeshStandardMaterial({
	color: new Color(0xFFFFFF),
	roughness: 0.2,
	metalness: 0.2
});

const entities: Map<string, Entity> = new Map<string, Entity>();

export class Entity {
	public mesh: Mesh;
	constructor(texture: EntityTexture) {
		this.mesh = new Mesh(geometry, material);
		this.mesh.matrixAutoUpdate = false;
		scene.add(this.mesh);
		entities.set(this.mesh.uuid, this);
	}

	remove(): void {
		scene.remove(this.mesh);
		entities.delete(this.mesh.uuid);
	}
}
