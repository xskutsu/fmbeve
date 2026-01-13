import { TextureLoader } from "three";
import { getSituateCommand } from "./fmbe/commands";
import { FMBEType } from "./fmbe/types";
import { OrbitCameraControl } from "./input/orbitCameraControl";
import { Editor } from "./live/editor";
import { Entity } from "./live/entity";
import type { MolangVariableMap } from "./molang/types";
import { createBlockMesh } from "./render/mesh/createBlockMesh";
import { Viewport } from "./render/view/viewport";

const editor: Editor = new Editor();

const middleContainerElement = document.getElementById("middle-container");
if (middleContainerElement === null) {
	throw new Error("Failed to get middle container element for viewport.");
}

const viewport: Viewport = new Viewport(middleContainerElement);
viewport.onresize = () => viewport.render(editor.scene);

const cameraControl: OrbitCameraControl = new OrbitCameraControl(
	viewport.camera,
	viewport.renderer.domElement
);

const molangVariables: MolangVariableMap = new Map([
	["q.life_time", () => performance.now() / 1000],
	["query.life_time", () => performance.now() / 1000],
	["q.vertical_speed", () => 0],
	["query.vertical_speed", () => 0],
	["q.modified_distance_moved", () => 0],
	["query.modified_distance_moved", () => 0]
]);

const loader = new TextureLoader();

const entity = new Entity(
	createBlockMesh({
		down: loader.load("assets/texture/block/debug_down.png"),
		east: loader.load("assets/texture/block/debug_east.png"),
		north: loader.load("assets/texture/block/debug_north.png"),
		south: loader.load("assets/texture/block/debug_south.png"),
		up: loader.load("assets/texture/block/debug_up.png"),
		west: loader.load("assets/texture/block/debug_west.png")
	}),
	{
		type: FMBEType.block3D,
		data: {
			position: {
				x: null,
				y: "math.sin(q.life_time * 67)",
				z: null
			},
			basePosition: {
				x: null,
				y: null,
				z: null
			},
			rotation: {
				x: null,
				y: null,
				z: null
			},
			scale: null,
			extend: {
				rotation: {
					x: null,
					y: null
				},
				scale: null
			}
		}
	}
);

editor.addEntity(entity);

console.log(getSituateCommand(entity.fmbe.data, "@e[type=fox]"));

function animateFrame(): void {
	cameraControl.update();
	editor.update(molangVariables);
	viewport.render(editor.scene);
	requestAnimationFrame(animateFrame);
}

animateFrame();
