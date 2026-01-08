import {
	BufferGeometry,
	Color,
	DoubleSide,
	Float32BufferAttribute,
	Mesh,
	MeshBasicMaterial
} from "three";
import { applyFaceShader } from "../shader/faceShader";
import { FACE } from "./constants";

const canvas: HTMLCanvasElement = document.createElement("canvas");
// biome-ignore lint/style/noNonNullAssertion: this will never be null
const ctx: CanvasRenderingContext2D = canvas.getContext("2d", {
	desynchronized: true,
	willReadFrequently: true
})!;

const cachedColor = new Color();
export function createItemMesh(image: HTMLImageElement, alphaThreshold: number = 10): Mesh {
	const size = Math.max(image.width, image.height);
	const pixelSize: number = 1 / size;
	canvas.width = size;
	canvas.height = size;
	ctx.drawImage(image, 0, 0, size, size);
	const data: ImageDataArray = ctx.getImageData(0, 0, size, size).data;
	const positions: number[] = [];
	const normals: number[] = [];
	const colors: number[] = [];
	const indices: number[] = [];
	let vertexCount: number = 0;
	const isOpaque = (x: number, y: number): boolean => {
		if (x < 0 || x >= size || y < 0 || y >= size) {
			return false;
		}
		const index: number = (y * size + x) * 4;
		return data[index + 3] > alphaThreshold;
	};
	const addFace = (
		x: number,
		y: number,
		faceCorners: number[][],
		normal: number[],
		r: number,
		g: number,
		b: number
	): void => {
		for (const corner of faceCorners) {
			positions.push(
				(x + corner[0]) * pixelSize,
				(y + corner[1]) * pixelSize,
				corner[2] * pixelSize
			);
			normals.push(normal[0], normal[1], normal[2]);
			colors.push(r, g, b);
		}
		indices.push(vertexCount, vertexCount + 1, vertexCount + 3);
		indices.push(vertexCount + 1, vertexCount + 2, vertexCount + 3);
		vertexCount += 4;
	};
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (!isOpaque(x, y)) {
				continue;
			}
			const index = (y * size + x) * 4;
			cachedColor.setRGB(
				data[index] / 255,
				data[index + 1] / 255,
				data[index + 2] / 255
			);
			cachedColor.convertSRGBToLinear();
			const { r, g, b } = cachedColor;
			const invY = size - y - 1;
			if (!isOpaque(x + 1, y)) {
				addFace(x, invY, FACE.Right, [1, 0, 0], r, g, b);
			}
			if (!isOpaque(x - 1, y)) {
				addFace(x, invY, FACE.Left, [-1, 0, 0], r, g, b);
			}
			if (!isOpaque(x, y - 1)) {
				addFace(x, invY, FACE.Top, [0, 1, 0], r, g, b);
			}
			if (!isOpaque(x, y + 1)) {
				addFace(x, invY, FACE.Bottom, [0, -1, 0], r, g, b);
			}
			addFace(x, invY, FACE.Front, [0, 0, 1], r, g, b);
			addFace(x, invY, FACE.Back, [0, 0, -1], r, g, b);
		}
	}
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
	geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
	geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
	geometry.setIndex(indices);
	geometry.translate(-(size / 2 - 0.5) * pixelSize, -(size / 2 - 0.5) * pixelSize, 0);
	const material = new MeshBasicMaterial({
		vertexColors: true,
		side: DoubleSide
	});
	applyFaceShader(material);
	canvas.width = 0;
	canvas.height = 0;
	return new Mesh(geometry, material);
}
