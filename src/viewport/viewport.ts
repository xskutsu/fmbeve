import { AxesHelper, Color, GridHelper, PerspectiveCamera, Scene, SRGBColorSpace, WebGLRenderer } from "three";
import { entities } from "../entity/entities";
import OrbitCameraControl from "./OrbitCameraControl";

const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = SRGBColorSpace;
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

export const scene: Scene = new Scene();
scene.background = new Color(0x111115);

const camera: PerspectiveCamera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);

window.addEventListener("resize", function (): void {
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth, innerHeight);
}, false);

export const orbit: OrbitCameraControl = new OrbitCameraControl(camera, 8, 0.0075, renderer.domElement);

const gridHelper1 = new GridHelper(3, 3, 0x444444, 0x444444);
gridHelper1.position.y -= 0.5;
scene.add(gridHelper1);

const gridHelper2 = new GridHelper(1, 16, 0x444444, 0x444444);
gridHelper2.position.y -= 0.5;
scene.add(gridHelper2);

const axesHelper = new AxesHelper(0.5);
axesHelper.scale.set(1, 0, 1);
axesHelper.position.y = -0.499;
scene.add(axesHelper);

export function animateFrame(): void {
	requestAnimationFrame(animateFrame);
	orbit.update();
	for (const entity of entities.values()) {
		entity.update();
	}
	renderer.render(scene, camera);
}

/** Linear transform gizmo
 * scene.add(new ArrowHelper(new Vector3(0, 0, 0), undefined, 0.5, new Color(0x00FF00), 0.075, 0.075));
 * scene.add(new ArrowHelper(new Vector3(1, 0, 0), undefined, 0.5, new Color(0xFF0000), 0.075, 0.075));
 * scene.add(new ArrowHelper(new Vector3(0, 0, 1), undefined, 0.5, new Color(0x0000FF), 0.075, 0.075));
 */
