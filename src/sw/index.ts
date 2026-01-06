/**
 * type MolangValue = number | string | null;

interface FMBEData {
	xpos: MolangValue;
	ypos: MolangValue;
	zpos: MolangValue;
	xbasepos: MolangValue;
	ybasepos: MolangValue;
	zbasepos: MolangValue;
	xrot: MolangValue;
	yrot: MolangValue;
	zrot: MolangValue;
	scale: MolangValue;
	extend_scale: MolangValue;
	extend_xrot: MolangValue;
	extend_yrot: MolangValue;
}

interface Entity {
	selector: string;
	fmbe: FMBEData;
}

const DEFAULT_FMBE_DATA_VALUES: FMBEData = {
	xpos: 0,
	ypos: 0,
	zpos: 0,
	xbasepos: 0,
	ybasepos: 0,
	zbasepos: 0,
	xrot: 0,
	yrot: 0,
	zrot: 0,
	scale: 1,
	extend_scale: 1,
	extend_xrot: -90,
	extend_yrot: 0
}

function getMolang(fmbe: FMBEData): string {
	const instructions: string[] = [];
	if (fmbe.xpos !== null) {
		instructions.push(`v.xpos=${fmbe.xpos}`);
	}
	if (fmbe.ypos !== null) {
		instructions.push(`v.ypos=${fmbe.ypos}`);
	}
	if (fmbe.zpos !== null) {
		instructions.push(`v.zpos=${fmbe.zpos}`);
	}
	if (fmbe.xrot !== null) {
		instructions.push(`v.xrot=${fmbe.xrot}`);
	}
	if (fmbe.yrot !== null) {
		instructions.push(`v.yrot=${fmbe.yrot}`);
	}
	if (fmbe.zrot !== null) {
		instructions.push(`v.zrot=${fmbe.zrot}`);
	}
	if (fmbe.scale !== null) {
		instructions.push(`v.scale=${fmbe.scale}`);
	}
	if (fmbe.extend_scale !== null) {
		instructions.push(`v.extend_scale=${fmbe.extend_scale}`);
	}
	if (fmbe.extend_xrot !== null) {
		instructions.push(`v.extend_xrot=${fmbe.extend_xrot}`);
	}
	if (fmbe.extend_yrot !== null) {
		instructions.push(`v.extend_yrot=${fmbe.extend_yrot}`);
	}
	if (fmbe.xbasepos !== null) {
		instructions.push(`v.baseposx=${fmbe.xbasepos}`);
	}
	if (fmbe.ybasepos !== null) {
		instructions.push(`v.baseposy=${fmbe.ybasepos}`);
	}
	if (fmbe.zbasepos !== null) {
		instructions.push(`v.baseposz=${fmbe.zbasepos}`);
	}
	return instructions.join(";");
}

function getCommand(entity: Entity, layerName: string = "fSet", blend: number = 0): string {
	const molang: string = getMolang(entity.fmbe);
	return `/playanimation ${entity.selector} animation.player.attack.positions _ ${blend} "${molang}" ${layerName}`;
}











if ("serviceWorker" in navigator) {
	window.addEventListener("load", function (): void {
		const response: Promise<ServiceWorkerRegistration> = this.navigator.serviceWorker.register("/js/sw.js");
		response.then(function (): void {
			console.log("Service worker registered.");
		});
		response.catch(function (error): void {
			console.error("Service worker failed to register.");
			console.error(error);
		});
	});
}

if ("orientation" in screen && "lock" in screen.orientation) {
	try {
		(screen.orientation.lock as any)("landscape");
	} catch (err: unknown) {

	}
}

 */

