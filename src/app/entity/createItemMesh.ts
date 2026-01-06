import {
	BufferGeometry,
	Color,
	DoubleSide,
	Float32BufferAttribute,
	Mesh,
	MeshBasicMaterial
} from "three";
import { FACE } from "../constants";
import { loadImage } from "../util/loadImage";
import { applyMinecraftShader } from "../viewport/applyMinecraftShading";

const cachedColor = new Color();
export async function createItemMesh(
	imageURL: string,
	pixelSize: number = 1 / 16,
	depth: number = 1 / 16,
	alphaThreshold: number = 10
): Promise<Mesh> {
	const imageElement: HTMLImageElement = await loadImage(imageURL);
	const canvasElement = document.createElement("canvas");
	const width: number = imageElement.width;
	const height: number = imageElement.height;
	canvasElement.width = width;
	canvasElement.height = height;
	const ctx = canvasElement.getContext("2d");
	if (ctx === null) {
		throw new Error("CanvasRenderingContext2D is not supported.");
	}
	ctx.drawImage(imageElement, 0, 0);
	const data: ImageDataArray = ctx.getImageData(0, 0, width, height).data;
	const positions: number[] = [];
	const normals: number[] = [];
	const colors: number[] = [];
	const indices: number[] = [];
	let vertexCount: number = 0;
	const isOpaque = (x: number, y: number): boolean => {
		if (x < 0 || x >= width || y < 0 || y >= height) {
			return false;
		}
		const index: number = (y * width + x) * 4;
		return data[index + 3] > alphaThreshold;
	};
	const getPixelColor = (x: number, y: number): [number, number, number] => {
		const index: number = (y * width + x) * 4;
		const r = data[index] / 255;
		const g = data[index + 1] / 255;
		const b = data[index + 2] / 255;
		cachedColor.setRGB(r, g, b);
		cachedColor.convertSRGBToLinear();
		return [cachedColor.r, cachedColor.g, cachedColor.b];
	};
	const addFace = (
		x: number,
		y: number,
		z: number,
		corners: number[][],
		normal: number[],
		color: [number, number, number]
	) => {
		for (const corner of corners) {
			positions.push(
				(x + corner[0]) * pixelSize,
				(y + corner[1]) * pixelSize,
				(z + corner[2]) * depth
			);
			normals.push(normal[0], normal[1], normal[2]);
			colors.push(color[0], color[1], color[2]);
		}
		const b: number = vertexCount + 1;
		const d: number = vertexCount + 3;
		indices.push(vertexCount, b, d);
		indices.push(b, vertexCount + 2, d);
		vertexCount += 4;
	};
	for (let y: number = 0; y < height; y++) {
		for (let x: number = 0; x < width; x++) {
			if (!isOpaque(x, y)) {
				continue;
			}
			const color: [number, number, number] = getPixelColor(x, y);
			const invY: number = height - y - 1;
			if (!isOpaque(x + 1, y)) {
				addFace(x, invY, 0, FACE.Right, [1, 0, 0], color);
			}
			if (!isOpaque(x - 1, y)) {
				addFace(x, invY, 0, FACE.Left, [-1, 0, 0], color);
			}
			if (!isOpaque(x, y - 1)) {
				addFace(x, invY, 0, FACE.Top, [0, 1, 0], color);
			}
			if (!isOpaque(x, y + 1)) {
				addFace(x, invY, 0, FACE.Bottom, [0, -1, 0], color);
			}
			addFace(x, invY, 0, FACE.Front, [0, 0, 1], color);
			addFace(x, invY, 0, FACE.Back, [0, 0, -1], color);
		}
	}
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
	geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
	geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
	geometry.setIndex(indices);
	geometry.translate(-(width / 2 - 0.5) * pixelSize, -(height / 2 - 0.5) * pixelSize, 0);
	const material = new MeshBasicMaterial({
		vertexColors: true,
		side: DoubleSide
	});
	applyMinecraftShader(material);
	return new Mesh(geometry, material);
}
