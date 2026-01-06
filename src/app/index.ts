import { TextureLoader } from "three";
import { createBlockMesh } from "./entity/createCubeMesh";
import { Entity } from "./entity/entities";
import { getCommand } from "./fmbe/getCommand";
import { animateFrame } from "./viewport/viewport";

animateFrame();

const o = new Entity(
	createBlockMesh({
		down: new TextureLoader().load(
			"assets/texture/block/debug_down.png",
		),
		east: new TextureLoader().load(
			"assets/texture/block/debug_east.png",
		),
		north: new TextureLoader().load(
			"assets/texture/block/debug_north.png",
		),
		south: new TextureLoader().load(
			"assets/texture/block/debug_south.png",
		),
		up: new TextureLoader().load(
			"assets/texture/block/debug_up.png",
		),
		west: new TextureLoader().load(
			"assets/texture/block/debug_west.png",
		),
	}),
	{
		basePosition: {
			x: null,
			y: null,
			z: null,
		},
		extend: {
			rotation: {
				x: null,
				y: null,
			},
			scale: null,
		},
		position: {
			x: null,
			y: 0,
			z: null,
		},
		rotation: {
			x: null,
			y: null,
			z: null,
		},
		scale: null,
	},
);

console.log(getCommand(o.fmbe, "@e[type=fox]"));
