import { BoxGeometry, Euler, Matrix4, Mesh } from "three";
import { DEG_TO_RAD } from "../constants";
import { parseFMBEValue } from "../fmbe/parseFMBEValue";
import { FMBE } from "../fmbe/types";
import { scene } from "../viewport/viewport";
import { createEntityMaterial } from "./createMaterial";
import { EntityTexture } from "./types";

const geometry = new BoxGeometry(1, 1, 1);

export const entities: Map<string, Entity> = new Map<string, Entity>();

export class Entity {
	public mesh: Mesh;
	public fmbe: FMBE;
	constructor(textures: EntityTexture, fmbe: FMBE) {
		this.mesh = new Mesh(geometry, createEntityMaterial(textures));
		this.mesh.matrixAutoUpdate = false;
		this.fmbe = fmbe;
		scene.add(this.mesh);
		entities.set(this.mesh.uuid, this);
	}

	public remove(): void {
		scene.remove(this.mesh);
		entities.delete(this.mesh.uuid);
		if (this.mesh.material instanceof Array) {
			for (const material of this.mesh.material) {
				material.dispose();
			}
		} else {
			this.mesh.material.dispose();
		}
	}

	public update(): void {
		const px: number = parseFMBEValue(this.fmbe.position.x, 0);
		const py: number = parseFMBEValue(this.fmbe.position.y, 0);
		const pz: number = parseFMBEValue(this.fmbe.position.z, 0);
		const rx: number = parseFMBEValue(this.fmbe.rotation.x, 0) * DEG_TO_RAD;
		const ry: number = -parseFMBEValue(this.fmbe.rotation.y, 0) * DEG_TO_RAD;
		const rz: number = -parseFMBEValue(this.fmbe.rotation.z, 0) * DEG_TO_RAD;
		const bx: number = parseFMBEValue(this.fmbe.basePosition.x, 0);
		const by: number = parseFMBEValue(this.fmbe.basePosition.y, 0);
		const bz: number = parseFMBEValue(this.fmbe.basePosition.z, 0);
		const s: number = parseFMBEValue(this.fmbe.scale, 1);
		const es: number = parseFMBEValue(this.fmbe.extend.scale, 1);
		const ex: number = parseFMBEValue(this.fmbe.extend.rotation.x, -90) * DEG_TO_RAD;
		const ey: number = -parseFMBEValue(this.fmbe.extend.rotation.y, 0) * DEG_TO_RAD;
		const matShear: Matrix4 = new Matrix4();
		const rxMatrix: Matrix4 = new Matrix4().makeRotationX(ex);
		const ryMatrix: Matrix4 = new Matrix4().makeRotationY(ey);
		matShear.multiply(ryMatrix);
		matShear.multiply(rxMatrix);
		matShear.multiply(new Matrix4().makeScale(1, 1, es));
		matShear.multiply(rxMatrix.transpose());
		matShear.multiply(ryMatrix.transpose());
		const extendMatrix: Matrix4 = new Matrix4();
		extendMatrix.multiply(matShear);
		extendMatrix.multiply(new Matrix4().makeScale(1, es, 1));
		const translationMatrix: Matrix4 = new Matrix4().makeTranslation(px, py, pz);
		const finalMatrix: Matrix4 = new Matrix4();
		finalMatrix.multiply(translationMatrix);
		finalMatrix.multiply(new Matrix4().makeRotationFromEuler(new Euler(rx, ry, rz, "YXZ")));
		finalMatrix.multiply(new Matrix4().makeScale(s, s, s));
		finalMatrix.multiply(extendMatrix);
		finalMatrix.multiply(new Matrix4().makeTranslation(bx, by, bz));
		this.mesh.matrix.copy(finalMatrix);
		this.mesh.updateMatrixWorld(true);
	}
}
