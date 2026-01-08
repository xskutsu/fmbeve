import type { Material, WebGLProgramParametersWithUniforms, WebGLRenderer } from "three";

const VERTEX_HEAD_REPLACE: string = `#include <common>
varying vec3 vMcWorldNormal;`;

const VERTEX_BODY_REPLACE: string = `#include <begin_vertex>
vMcWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);`;

const FRAG_HEAD_REPLACE: string = `#include <common>
varying vec3 vMcWorldNormal;`;

const FRAG_BODY_REPLACE: string = `#include <dithering_fragment>
vec3 N = normalize(vMcWorldNormal);
float nx2 = N.x * N.x;
float ny2 = N.y * N.y;
float nz2 = N.z * N.z;
float brightness = (N.y > 0.0) ? 0.988 : 0.5;
float lightLevel = (nx2 * 0.62) + (nz2 * 0.82) + (ny2 * brightness);
gl_FragColor.rgb *= lightLevel;`;

type BeforeCompileCallback = (
	shader: WebGLProgramParametersWithUniforms,
	renderer: WebGLRenderer
) => void;

const beforeCompileMap: WeakMap<Material, BeforeCompileCallback> = new WeakMap();

export function applyFaceShader(material: Material): void {
	if (material.onBeforeCompile) {
		beforeCompileMap.set(material, material.onBeforeCompile);
	}
	material.onBeforeCompile = (shader, renderer) => {
		const callback: BeforeCompileCallback | undefined = beforeCompileMap.get(material);
		if (callback !== undefined) {
			callback(shader, renderer);
		}
		shader.vertexShader = shader.vertexShader.replace(
			"#include <common>",
			VERTEX_HEAD_REPLACE
		);
		shader.vertexShader = shader.vertexShader.replace(
			"#include <begin_vertex>",
			VERTEX_BODY_REPLACE
		);
		shader.fragmentShader = shader.fragmentShader.replace(
			"#include <common>",
			FRAG_HEAD_REPLACE
		);
		shader.fragmentShader = shader.fragmentShader.replace(
			"#include <dithering_fragment>",
			FRAG_BODY_REPLACE
		);
	};
	material.needsUpdate = true;
}
