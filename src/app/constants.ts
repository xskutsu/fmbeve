export const DEG_TO_RAD: number = Math.PI / 180;

export const RAD_TO_DEG: number = 180 / Math.PI;

export const FACE = {
	Back: [
		[0.5, -0.5, -0.5],
		[-0.5, -0.5, -0.5],
		[-0.5, 0.5, -0.5],
		[0.5, 0.5, -0.5],
	],
	Bottom: [
		[-0.5, -0.5, -0.5],
		[0.5, -0.5, -0.5],
		[0.5, -0.5, 0.5],
		[-0.5, -0.5, 0.5],
	],
	Front: [
		[-0.5, -0.5, 0.5],
		[0.5, -0.5, 0.5],
		[0.5, 0.5, 0.5],
		[-0.5, 0.5, 0.5],
	],
	Left: [
		[-0.5, -0.5, -0.5],
		[-0.5, -0.5, 0.5],
		[-0.5, 0.5, 0.5],
		[-0.5, 0.5, -0.5],
	],
	Right: [
		[0.5, -0.5, 0.5],
		[0.5, -0.5, -0.5],
		[0.5, 0.5, -0.5],
		[0.5, 0.5, 0.5],
	],
	Top: [
		[-0.5, 0.5, 0.5],
		[0.5, 0.5, 0.5],
		[0.5, 0.5, -0.5],
		[-0.5, 0.5, -0.5],
	],
} satisfies Record<
	string,
	[
		[number, number, number],
		[number, number, number],
		[number, number, number],
		[number, number, number],
	]
>;
