import type { FMBEData, FMBEValue } from "./types";

export function getSituateCommand(fmbe: FMBEData, selector: string): string {
	let molang: string = "";
	const pinn = (key: string, value: FMBEValue): void => {
		if (value !== null) {
			molang += `${key}=${value};`;
		}
	};
	pinn("v.xpos", fmbe.position.x);
	pinn("v.ypos", fmbe.position.y);
	pinn("v.zpos", fmbe.position.z);
	pinn("v.xrot", fmbe.rotation.x);
	pinn("v.yrot", fmbe.rotation.y);
	pinn("v.zrot", fmbe.rotation.z);
	pinn("v.xbasepos", fmbe.basePosition.x);
	pinn("v.ybasepos", fmbe.basePosition.y);
	pinn("v.zbasepos", fmbe.basePosition.z);
	pinn("v.scale", fmbe.scale);
	pinn("v.extend_scale", fmbe.extend.scale);
	pinn("v.extend_xrot", fmbe.extend.rotation.x);
	pinn("v.extend_yrot", fmbe.extend.rotation.y);
	return [
		"playanimation",
		selector,
		"animation.player.attack.positions",
		"none",
		"0",
		molang,
		"setvariable_0"
	].join(" ");
}
