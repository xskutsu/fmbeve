import type { Mesh } from "three";
import { DEG_TO_RAD } from "../constants";
import { parseFMBEValue } from "../fmbe/parseFMBEValue";
import type { FMBE } from "../fmbe/types";
import { scene } from "../viewport/viewport";

export const entities: Map<string, Entity> = new Map<string, Entity>();

export class Entity {
	public mesh: Mesh;
	public fmbe: FMBE;
	constructor(mesh: Mesh, fmbe: FMBE) {
		this.mesh = mesh;
		this.mesh.matrixAutoUpdate = false;
		this.fmbe = fmbe;
		scene.add(this.mesh);
		entities.set(this.mesh.uuid, this);
	}

	public remove(): void {
		scene.remove(this.mesh);
		entities.delete(this.mesh.uuid);
		if (Array.isArray(this.mesh.material)) {
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

		// cache trig for the extend rotation
		const cEx: number = Math.cos(ex);
		const sEx: number = Math.sin(ex);
		const cEy: number = Math.cos(ey);
		const sEy: number = Math.sin(ey);

		// direction vector w (Z-axis of Ry(ey) * Rx(ex))
		// this defines the direction of the extend aka shear
		const wx: number = sEy * cEx;
		const wy: number = -sEx;
		const wz: number = cEy * cEx;

		// shear matrix elements (3x3)
		// M_shear = I + (es - 1) * w * w^T
		const k: number = es - 1;
		const m00: number = 1 + k * wx * wx;
		const m01: number = k * wx * wy;
		const m02: number = k * wx * wz;
		const m11: number = 1 + k * wy * wy;
		const m12: number = k * wy * wz;
		const m22: number = 1 + k * wz * wz;

		// secondary Y-scale multiplier.
		// only blocks apply es again on the y axis.
		const scaleY: number = this.mesh.geometry.type === "BoxGeometry" ? es : 1;

		// compute M_ext columns by applying the non-uniform scale S(1, scaleY, 1)
		// column 0 (unscaled)
		const e00: number = m00;
		const e10: number = m01;
		const e20: number = m02;
		// column 1 (scaled by scaleY)
		const e01: number = m01 * scaleY;
		const e11: number = m11 * scaleY;
		const e21: number = m12 * scaleY;
		// column 2 (unscaled)
		const e02: number = m02;
		const e12: number = m12;
		const e22: number = m22;

		// main rotation R (YXZ) with scale s
		const c1: number = Math.cos(rx);
		const s1: number = Math.sin(rx);
		const c2: number = Math.cos(ry);
		const s2: number = Math.sin(ry);
		const c3: number = Math.cos(rz);
		const s3: number = Math.sin(rz);

		// elements of R * s
		const r00: number = (c2 * c3 + s2 * s1 * s3) * s;
		const r01: number = (s2 * s1 * c3 - c2 * s3) * s;
		const r02: number = s2 * c1 * s;

		const r10: number = c1 * s3 * s;
		const r11: number = c1 * c3 * s;
		const r12: number = -s1 * s;

		const r20: number = (c2 * s1 * s3 - s2 * c3) * s;
		const r21: number = (c2 * s1 * c3 + s2 * s3) * s;
		const r22: number = c2 * c1 * s;

		// final 3x3 rotation
		// M_final = (R * s) * M_ext
		const f00: number = r00 * e00 + r01 * e10 + r02 * e20;
		const f01: number = r00 * e01 + r01 * e11 + r02 * e21;
		const f02: number = r00 * e02 + r01 * e12 + r02 * e22;

		const f10: number = r10 * e00 + r11 * e10 + r12 * e20;
		const f11: number = r10 * e01 + r11 * e11 + r12 * e21;
		const f12: number = r10 * e02 + r11 * e12 + r12 * e22;

		const f20: number = r20 * e00 + r21 * e10 + r22 * e20;
		const f21: number = r20 * e01 + r21 * e11 + r22 * e21;
		const f22: number = r20 * e02 + r21 * e12 + r22 * e22;

		// final Translation
		// T_final = (M_final_3x3 * BasePos) + Position
		const tx: number = f00 * bx + f01 * by + f02 * bz + px;
		const ty: number = f10 * bx + f11 * by + f12 * bz + py;
		const tz: number = f20 * bx + f21 * by + f22 * bz + pz;

		this.mesh.matrix.set(
			f00,
			f01,
			f02,
			tx,
			f10,
			f11,
			f12,
			ty,
			f20,
			f21,
			f22,
			tz,
			0,
			0,
			0,
			1
		);
		this.mesh.updateMatrixWorld(true);
	}
}
