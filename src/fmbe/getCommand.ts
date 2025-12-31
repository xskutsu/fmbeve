import { FMBE, FMBEValue } from "./types";

export function getCommand(fmbe: FMBE, selector: string, layerName: string = "wiki:setvariable_0", blend: number = 0): string {
	const molang: string[] = [];
	const pushIfNotNull = (key: string, value: FMBEValue): void => {
		if (value !== null) {
			molang.push(`${key}=${value}`);
		}
	};
	pushIfNotNull("v.xpos", fmbe.position.x);
	pushIfNotNull("v.ypos", fmbe.position.y);
	pushIfNotNull("v.zpos", fmbe.position.z);
	pushIfNotNull("v.xrot", fmbe.rotation.x);
	pushIfNotNull("v.yrot", fmbe.rotation.y);
	pushIfNotNull("v.zrot", fmbe.rotation.z);
	pushIfNotNull("v.xbasepos", fmbe.basePosition.x);
	pushIfNotNull("v.ybasepos", fmbe.basePosition.y);
	pushIfNotNull("v.zbasepos", fmbe.basePosition.z);
	pushIfNotNull("v.scale", fmbe.scale);
	pushIfNotNull("v.extend_scale", fmbe.extend.scale);
	pushIfNotNull("v.extend_xrot", fmbe.extend.rotation.x);
	pushIfNotNull("v.extend_yrot", fmbe.extend.rotation.y);
	return `/playanimation ${selector} animation.player.attack.positions none ${blend} "${molang.join(";")};" ${layerName}`;
}
