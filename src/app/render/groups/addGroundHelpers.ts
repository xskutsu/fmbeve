import { AxesHelper, GridHelper, type Group } from "three";

export function addGroundHelpers(group: Group): void {
	const gridHelper1 = new GridHelper(3, 3, 0x444444, 0x444444);
	gridHelper1.position.y -= 0.5;
	group.add(gridHelper1);

	const gridHelper2 = new GridHelper(1, 16, 0x444444, 0x444444);
	gridHelper2.position.y -= 0.5;
	group.add(gridHelper2);

	const axesHelper = new AxesHelper(0.5);
	axesHelper.scale.set(1, 0, 1);
	axesHelper.position.y = -0.499;
	group.add(axesHelper);
}
