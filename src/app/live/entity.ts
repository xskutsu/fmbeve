import type { Mesh } from "three";
import { generateUUID } from "three/src/math/MathUtils.js";
import type { FMBE } from "../fmbe/types";
import type { MolangVariableMap } from "../molang/types";
import { updateFMBEMatrix } from "../render/fmbe/updateFMBEMatrix";

export class Entity {
	public uuid: string;
	public mesh: Mesh;
	public fmbe: FMBE;

	constructor(mesh: Mesh, fmbe: FMBE) {
		this.uuid = generateUUID();
		this.mesh = mesh;
		this.fmbe = fmbe;
	}

	public dispose(): void {
		this.mesh.geometry.dispose();
		if (Array.isArray(this.mesh.material)) {
			for (const material of this.mesh.material) {
				material.dispose();
			}
		} else {
			this.mesh.material.dispose();
		}
	}

	public update(variables: MolangVariableMap | null): void {
		updateFMBEMatrix(this.mesh, this.fmbe.data, variables);
	}
}
